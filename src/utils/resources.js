import { getResourceLink } from 'single-scripture-rcl'
import { core } from 'scripture-resources-rcl'
import {
  HTTP_GET_MAX_WAIT_TIME,
  LOADING_RESOURCE,
  MANIFEST_INVALID_ERROR,
  MANIFEST_NOT_FOUND_ERROR,
} from '@common/constants'
import {
  INITIALIZED_STATE,
  INVALID_MANIFEST_ERROR,
  LOADING_STATE,
  MANIFEST_NOT_LOADED_ERROR,
} from 'translation-helps-rcl'
import { doFetch } from '@utils/network'

export async function getResource({
  bookId,
  chapter,
  verse,
  resourceId,
  owner,
  languageId,
  ref,
  server,
}) {
  const resourceLink = getResourceLink({
    owner,
    languageId,
    resourceId,
    ref,
  })

  let resource

  try {
    resource = await core.resourceFromResourceLink({
      resourceLink,
      reference: {
        projectId: bookId,
        chapter: chapter,
        verse: verse,
      },
      config: {
        server,
        cache: { maxAge: 1 * 60 * 60 * 1000 }, // 1 hr
        timeout: HTTP_GET_MAX_WAIT_TIME,
      },
    })
  } catch (e) {
    console.log(`getResource(${resourceLink}) failed, exception: `, e)
  }

  resource = resource || {}
  resource.resourceLink = getRepoUrl(owner, languageId, resourceId, server)
  return resource
}

export async function getResourceManifest(resourceRef) {
  const resource = await getResource(resourceRef)

  if (!resource?.manifest) {
    console.log(`getResourceManifest(${ getResourceLink(resourceRef) }) failed`)
    return null
  }

  return resource?.manifest
}

export async function getResourceBibles(resourceRef) {
  let bibles = null
  let httpCode = null
  const resource = await getResource(resourceRef)

  if (resource?.manifest?.projects) {
    bibles = resource.manifest.projects.map((item) => (item.identifier))
  } else {
    console.log(`getResourceBibles() response`, resource?.manifestHttpResponse)
    httpCode = resource?.manifestHttpResponse?.status
  }

  const resourceLink = resource?.resourceLink
  return {
    bibles,
    httpCode,
    resourceLink,
  }
}

/**
 * make url for repo
 * @param owner
 * @param languageId
 * @param resourceId
 * @param server
 * @return {string}
 */
export function getRepoUrl(owner, languageId, resourceId, server) {
  const repoUrl = `${owner}/${languageId}_${resourceId}`
  return `${server || ''}/${repoUrl}`
}

/**
 * Appends path to resource repo to error message
 * @param errorStr - base error message
 * @param owner
 * @param languageId
 * @param resourceId
 * @param server
 * @param {string} ref - optional ref (branch or tag)
 * @return {string} error string with resource path
 */
export function getErrorMessageForResourceLink(errorStr, owner, languageId, resourceId, server, ref = null) {
  let repoUrl = getRepoUrl(owner, languageId, resourceId, server)

  if (ref) {
    repoUrl += `&ref=${ref}`
  }

  const errorMsg = errorStr + repoUrl
  return errorMsg
}


/**
 * decode resource status into string.  Currently only English
 * @param resourceStatus - object that contains state and errors that are detected
 * @param owner
 * @param languageId
 * @param resourceId
 * @param server - contains the server being used
 * @param {string} ref - optional ref (branch or tag)
 * @return empty string if no error, else returns user error message
 */
export function getResourceMessage(resourceStatus, owner, languageId, resourceId, server, ref = null) {
  let message = ''

  if (resourceStatus[LOADING_STATE]) {
    message = LOADING_RESOURCE
  } else if (resourceStatus[INITIALIZED_STATE]) {
    if (resourceStatus[MANIFEST_NOT_LOADED_ERROR]) {
      message = MANIFEST_NOT_FOUND_ERROR
    } else if (resourceStatus[INVALID_MANIFEST_ERROR]) {
      message = MANIFEST_INVALID_ERROR
    }

    if (message) {
      message = getErrorMessageForResourceLink(message, owner, languageId, resourceId, server, ref)
      console.log(`getResourceMessage() - Resource Error: ${message}`, resourceStatus)
    }
  }
  return message
}

/**
 * find the latest version for published bible
 * @param {string} server
 * @param {string} org
 * @param {string} lang
 * @param {string} bible
 * @param {function} processError
 * @return {Promise<*>}
 */
export async function getLatestBibleRepo(server, org, lang, bible, processError) {
  const url = `${server}/api/catalog/v5/search/${org}/${lang}_${bible}`
  const results = await doFetch(url, {}, HTTP_GET_MAX_WAIT_TIME)
    .then(response => {
      if (response?.status !== 200) {
        const errorCode = response?.status
        console.warn(`WorkSpace - error getting latest original lang from ${url}, ${errorCode}`)
        processError(null, errorCode)
        return null
      }
      return response?.data
    })
  const foundItem = results?.data?.[0]
  let repo = foundItem?.url

  if (foundItem?.metadata_api_contents_url) {
    // "metadata_api_contents_url": "https://qa.door43.org/api/v1/repos/unfoldingWord/el-x-koine_ugnt/contents/manifest.yaml?ref=v0.9"
    let parts = foundItem?.metadata_api_contents_url.split('?')
    let pathParts = parts[0].split('/')
    pathParts = pathParts.slice(0, -1)
    repo = pathParts.join('/') + '?' + parts[1]
  }
  return repo
}

export function delay(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  )
}
