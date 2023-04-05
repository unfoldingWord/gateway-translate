import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// AUTH: import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
// AUTH: import { RepositoryApi, OrganizationApi } from 'dcs-js'
import { decodeBase64ToUtf8 } from '@utils/base64Decode'
import { randomLetters } from '@utils/randomLetters'

export const AppContext = React.createContext({})

export default function AppContextProvider({ children }) {
  const [books, setBooks] = useState([])
  const [ltStState, setLtStState] = useState('')
  const [refresh, setRefresh] = useState(true)

  const {
    state: { owner, server, languageId },
    actions: { setCurrentLayout },
  } = useContext(StoreContext)

  const _setBooks = value => {
    setBooks(value)
    setRefresh(true)
    setCurrentLayout(null)
  }

  // monitor the refresh state and act when true
  useEffect(() => {
    async function getContent() {
      let _books = books

      for (let i = 0; i < _books.length; i++) {
        if (!_books[i].content) {
          let _content = null
          try {
            switch (_books[i].source) {
              case 'url':
                let _url = _books[i].url
                // auto change src/branch to raw/branch
                _url = _url.replace('/src/branch/', '/raw/branch/')
                const response = await fetch(_url)
                const rawContent = await response.text()
                _content = {
                  content: rawContent,
                  encoding: 'plain',
                }
                _books[i].docset =
                  'org-unk/' + randomLetters(3) + '_' + randomLetters(3)
                break
              case 'upload':
              default:
                _content = {
                  content: _books[i].usfmText,
                  encoding: 'plain',
                }
                _books[i].docset =
                  'org-unk/' + randomLetters(3) + '_' + randomLetters(3)
                break
            }
          } catch (e) {
            console.error(e)
            _content = 'NO CONTENT AVAILABLE'
          }
          _books[i].content = _content

          // note that "content" is the JSON returned from DCS.
          // the actual content is base64 encoded member element "content"
          let _usfmText
          if (_content && _content.encoding && _content.content) {
            if ('base64' === _content.encoding) {
              _usfmText = decodeBase64ToUtf8(_content.content)
            } else {
              _usfmText = _content.content
            }
            _books[i].usfmText = _usfmText

            // extract bookId from text
            const _regex = /^\\id ([A-Z0-9]{3})/
            const _found = _usfmText.match(_regex)
            const _textBookId = _found[1]
            console.log('ID from USFM Text:', _textBookId)
            // if no id found, consider it invalid USFM
            if (!_textBookId) {
              _books[i].bookId = 'unknown'
              _books[i].usfmText = null
              _books[i].content = "INVALID USFM: No 'id' marker"
            } else {
              // let id from usfm text take precedence
              if (_books[i].bookId !== _textBookId) {
                _books[i].bookId = _textBookId
              }
            }
          } else {
            _books[i].usfmText = null
          }
          books[i].showCard = true
        }
      }
      setBooks(_books)
      console.log('setBooks():', _books)
      setRefresh(false)
    }
    if (refresh) {
      getContent().catch(console.error)
    }
  }, [
    // AUTH: authentication,
    owner,
    server,
    languageId,
    refresh,
    books,
    setBooks,
    // AUTH: repoClient,
  ])

  // create the value for the context provider
  const context = {
    state: {
      books,
      ltStState,
      // AUTH - repoClient,
      // AUTH - organizationClient,
    },
    actions: {
      setBooks: _setBooks,
      setLtStState,
    },
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

AppContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

/**
 * AUTH CODE GRAVEYARD
 *
 *  const getApiConfig = ({
      token,
      basePath = 'https://qa.door43.org/api/v1/',
    }) => ({
      apiKey: token && (key => (key === 'Authorization' ? `token ${token}` : '')),
      basePath: basePath?.replace(/\/+$/, ''),
    })

    useEffect(() => {
      if (authentication && authentication?.token) {
        const _configuration = getApiConfig({
          token: authentication.token.sha1,
          basePath: `${server}/api/v1/`,
        })
        setRepoClient(new RepositoryApi(_configuration))
        setOrganizationClient(new OrganizationApi(_configuration))
      }
    }, [authentication, server])

    const [repoClient, setRepoClient] = useState(null)
    const [organizationClient, setOrganizationClient] = useState(null)

    const {
      state: { authentication },
    } = useContext(AuthContext)
 */
