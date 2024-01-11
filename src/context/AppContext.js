import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { RepositoryApi, OrganizationApi, CatalogApi } from 'dcs-js';
import {usfmFilename} from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';
import { LITERAL, SIMPLIFIED, CUSTOM } from '@common/constants';
import { fetchContent } from '@utils/fetchContent';
import { randomLetters } from '@utils/randomLetters';
import { useRouter } from 'next/router'

export const AppContext = React.createContext({});

export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useState([])
  const [hasOpenBook,setHasOpenBook] = useState(false)
  const [ltStState, setLtStState] = useState('')
  const [refresh, setRefresh] = useState(true)
  const [repoClient, setRepoClient] = useState(null)
  const [catalogClient, setCatalogClient] = useState(null)
  const [organizationClient, setOrganizationClient] = useState(null)

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      owner,
      server,
      languageId,
    },
    actions: {
      setCurrentLayout,
      setNewBibleBook,
    }
  } = useContext(StoreContext)

  const router = useRouter()

  const getApiConfig = ({ token, basePath = "https://qa.door43.org/api/v1/" }) => ({
    apiKey: token && ((key) => key === "Authorization" ? `token ${token}` : ""),
    basePath: basePath?.replace(/\/+$/, ""),
  })

  useEffect(
    () => {
      if ( authentication && authentication?.token ) {
          const _configuration = getApiConfig({ token: authentication.token.sha1, basePath:`${server}/api/v1/` });
          setRepoClient(new RepositoryApi(_configuration))
          setCatalogClient(new CatalogApi(_configuration))
          setOrganizationClient(new OrganizationApi(_configuration))
      }
    },[authentication, server]
  )

  const _setBooks = (value) => {
    // debugger
    const _hasOpenBook = (value?.filter( b => b.showCard )?.length>0)
    setHasOpenBook(_hasOpenBook)
    setBooks(value)
    setRefresh(true)
    setCurrentLayout(null)
  }

  useEffect(() => {
    const addResourceFromRoute = async () => {
      const info = router.query.ownerRepoRefBook
      if (info.length < 2) {
        return
      }
      const owner = info[0]
      const repo = info[1]
      let ref = info[2]
      let bookId = info[3]
      let content = null
      let repoObj = null
      if (!ref) {
        repoObj = await repoClient.repoGet({owner, repo}).then(({ data }) => data)
        console.log(repoObj)
        if (repoObj != null) {
          ref = repoObj.default_branch
        }
        console.log("REF", ref)
      }
      const catalogEntry = await catalogClient.catalogGetEntry({owner, repo, tag: ref}).then(({ data }) => data)
      if (! catalogEntry) {
        content = `Unable to find this resource on DCS: ${owner}/${repo}/src/branch/${ref || "master"}`
      } else if (!bookId && catalogEntry.ingredients.length > 0) {
        for(let i = 0; i < catalogEntry.ingredients.length; i++) {
          if (catalogEntry.ingredients[i].identifier != "frt") {
            bookId = catalogEntry.ingredients[i].identifier
            break
          }
        }
      }
      let _books = [...books]
      let _entry = { 
        id: `${bookId}-${owner}/${repo}/${ref}`,
        owner,
        repo,
        ref,
        catalogEntry,
        bookId,
        source: "dcs",
        content,
        showCard: true,
        readOnly: true,
      }
      let found = -1
      let showCardChange = false
      for (let i=0; i<_books.length; i++) {
        if ( _books[i].id === _entry.id ) {
          if ( _books[i].showCard ) {
            found = i
          } else { 
            if (_books[i]?.showCard === false ) {
              found = i 
              _books[i].showCard = true
              showCardChange = true
            }
          }
          break
        }
      }
      setNewBibleBook(_entry.bookId)
      if ( found > -1 ) {
        if ( showCardChange ) {
          _setBooks(_books) // update to reflect change above
        }
      } else {
        _books.push(_entry)
        _setBooks(_books)
      }
    }

    if (router.query.ownerRepoRefBook && repoClient && catalogClient) {
      addResourceFromRoute()
    }
  }, [router.query.ownerRepoRefBook, repoClient, catalogClient])

  // monitor the refresh state and act when true
  useEffect(() => {
    async function getContent() {
      let _books = [...books]
      const _trace = "AppContext.js/useEffect()/getContent()"
      let _changeCount = 0
      for (let i=0; i<_books.length; i++) {
        if ( ! _books[i].content ) {
          let _content = null
          _changeCount++
          try {
            switch ( _books[i].source ) {
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
                _books[i].docset = "org-unk/" + randomLetters(3) + "_" + randomLetters(3)
                break;
              case 'upload':
                _content = {
                  content: _books[i].usfmText,
                  encoding: 'plain',
                }
                _books[i].docset = "org-unk/" + randomLetters(3) + "_" + randomLetters(3)
                break;
              case 'dcs':
              default:
                _content = await fetchContent(
                  _books[ i ].catalogEntry,
                  _books[ i ].bookId,
                  repoClient,
                )
                let langAndAbbr
                if (_books[i].repo.includes('_')) {
                  // check for multiple underscores. This addresses issue 164
                  // and dealing with:
                  // https://qa.door43.org/Pt-br_gl/ULB_L3_WA
                  const _pieces = _books[i].repo.split('_') 
                  if ( _pieces.length > 2 ) {
                    langAndAbbr = _pieces[0] + '_' + _pieces[1] // just take the first two pieces
                  } else {
                    langAndAbbr = _books[i].repo // take it all
                  }
                } else {
                  // work around for https://github.com/unfoldingWord/uw-editor/issues/38
                  langAndAbbr = _books[i].repo + '_tla' // 'tla' = Three Letter Acronym
                }
                _books[i].docset = _books[i].owner + "/" + langAndAbbr
                break;
            }
          } catch (e) {
            console.error(e)
            _content = "NO CONTENT AVAILABLE"
          }
          _books[ i ].content = _content

          // note that "content" is the JSON returned from DCS.
          // the actual content is base64 encoded member element "content"
          let _usfmText;
          if (_content && _content.encoding && _content.content) {
            if ('base64' === _content.encoding) {
              _usfmText = decodeBase64ToUtf8(_content.content)
            } else {
              _usfmText = _content.content
            }
            _books[i].usfmText = _usfmText

            // extract bookId from text
            const _regex = /^\\id ([A-Z0-9]{3})/;
            const _found = _usfmText.match(_regex);
            const _textBookId = _found[1];
            // if no id found, consider it invalid USFM
            if ( ! _textBookId ) {
              _books[i].bookId = 'unknown'
              _books[i].usfmText = null
              _books[i].content = "INVALID USFM: No 'id' marker"
            } else {
              // let id from usfm text take precedence
              if ( _books[i].bookId !== _textBookId ) {
                _books[i].bookId = _textBookId
              }
            }
          } else {
            _books[i].usfmText = null
          }
          _books[i].showCard = true
          _books[i].trace = _trace
        }
      }
      if ( _changeCount > 0 ) {
        console.log(_trace + ": changes made. before:", books)
        setBooks(_books)
        console.log(_trace + ": changes made. after:", _books)
      }
      setRefresh(false)
    }
    if (refresh && authentication && owner && server && languageId) {
      getContent().catch(console.error)
    }
  }, [authentication, owner, server, languageId, refresh, books, setBooks, repoClient, catalogClient])


  // create the value for the context provider
  const context = {
    state: {
      books,
      hasOpenBook,
      ltStState,
      repoClient,
      catalogClient,
      organizationClient,
    },
    actions: {
      setBooks: _setBooks,
      setLtStState,
    }
  };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
