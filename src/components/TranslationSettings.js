import React, {
  useContext, useEffect, useState,
} from 'react'
import PropTypes from 'prop-types'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { getGatewayLanguages } from '@common/languages'
import { StoreContext } from '@context/StoreContext'
import FormHelperText from '@mui/material/FormHelperText'
import {
  HTTP_GET_MAX_WAIT_TIME,
  LOADING,
  NO_ORGS_ERROR,
  ORGS_NETWORK_ERROR,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import { useRouter } from 'next/router'
import { AuthContext } from '@context/AuthContext'
import NetworkErrorPopup from '@components/NetworkErrorPopUp'
import CircularProgress from './CircularProgress'

const sx = {
  formControl: {
    marginTop: (theme) => theme.spacing(3),
    marginBottom: (theme) => theme.spacing(3),
    minWidth: '100%',
  },
}

export default function TranslationSettings({ authentication }) {
  const router = useRouter()
  const { actions: { logout } } = useContext(AuthContext)
  const [organizations, setOrganizations] = useState([])
  const [orgErrorMessage, setOrgErrorMessage] = useState(null)
  const [languages, setLanguages] = useState([])
  const [networkError, setNetworkError] = useState(null)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
    actions: {
      setOwner: setOrganization,
      setLanguageId,
      setLastError,
    },
  } = useContext(StoreContext)


  useEffect(() => {
      /**
   * in the case of a network error, process and display error dialog
   * @param {string|Error} error - initial error message message or object
   * @param {number} httpCode - http code returned
   */
    function processError(error, httpCode=0) {
      processNetworkError(error, httpCode, logout, router, setNetworkError, setLastError, setOrgErrorMessage )
    }

    async function getOrgs() {
      setOrgErrorMessage(LOADING)
      setLastError(null)
      let errorCode = 0

      try {
        const orgs = await doFetch(`${server}/api/v1/user/orgs`,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`TranslationSettings - error fetching user orgs, status code ${errorCode}`)
              processError(null, errorCode)
              return null
            }
            return response?.data
          })
          .then(data => {
            if (Array.isArray(data)) {
              return data.map(org => org.username)
            } else {
              return []
            }
          })

        if (!orgs?.length) { // if no orgs
          console.warn(`TranslationSettings - empty orgs`)
          setOrgErrorMessage(NO_ORGS_ERROR)
        } else {
          setOrgErrorMessage(null)
        }

        setOrganizations(orgs)
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`TranslationSettings - error fetching user orgs, message '${message}', disconnected=${disconnected}`, e)
        setOrganizations([])
        setOrgErrorMessage(disconnected ? ORGS_NETWORK_ERROR : NO_ORGS_ERROR)
        processError(e)
      }
    }

    if (authentication) {
      getOrgs()
    }
  }, [authentication, server, setLastError, logout, router])

  useEffect(() => {
    async function getLanguages() {
      const languages = await getGatewayLanguages()
      setLanguages(languages || [])
    }

    getLanguages()
  }, [])

  const handleOrgChange = event => {
    setOrganization(event.target.value)
  }

  const handleLanguageChange = event => {
    setLanguageId(event.target.value)
  }

  return (
    <>
      { !!networkError &&
        <NetworkErrorPopup
          networkError={networkError}
          setNetworkError={setNetworkError}
          onActionButton={onNetworkActionButton}
          onRetry={networkError?.authenticationError ? null : reloadApp}
        />
      }
      {
        organizations.length > 0 
        ?
        <Paper className='flex flex-col h-80 w-full p-6 pt-3 my-2'>
          <h5>Translation Settings</h5>
          <div className='flex flex-col justify-between my-4'>
            <FormControl variant='outlined' sx={sx.formControl} error={!!orgErrorMessage}>
              <InputLabel id='demo-simple-select-outlined-label'>
                Organization
              </InputLabel>
              <Select
                labelId='organization-select-outlined-label'
                id='organization-select-outlined'
                value={organization}
                onChange={handleOrgChange}
                label='Organization'
              >
                {organizations.map((org, i) => (
                  <MenuItem key={`${org}-${i}`} value={org}>
                    {org}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText id='organization-select-message'>{orgErrorMessage}</FormHelperText>
            </FormControl>
            <br />
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel id='demo-simple-select-outlined-label'>
                Primary Translating Language
              </InputLabel>
              <Select
                labelId='primary-language-select-outlined-label'
                id='primary-language-select-outlined'
                value={languageId}
                onChange={handleLanguageChange}
                label='Primary Translating Language'
              >
                {languages.map(({
                  languageId, languageName, localized,
                }, i) => (
                  <MenuItem key={`${languageId}-${i}`} value={languageId}>
                    {`${languageId} - ${languageName} - ${localized}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Paper>
        :
        <CircularProgress />
      }
    </>
  )
}

TranslationSettings.propTypes = { authentication: PropTypes.object }
