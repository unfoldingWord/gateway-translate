import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { usfm2perf } from '@utils/usfm2perf';
import { useRepoClient } from 'dcs-react-hooks';
import EpiteleteHtml from "epitelete-html";
import {usfmFilename} from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';
import { LITERAL, SIMPLIFIED, CUSTOM } from '@common/constants';
import { fetchFromUserBranch } from '@utils/fetchFromUserBranch';

export const AppContext = React.createContext({});

export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useState([])
  const [ltStState, setLtStState] = useState('')
  const [refresh, setRefresh] = useState(true)
  // const [ep, /*setEp*/] = useState(new EpiteletePerfHtml({
  //   proskomma: null, docSetId: "unfoldingWord/en_ltst", options: { historySize: 100 }
  // }))
  const [ep, setEp] = useState({})

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
    }
  } = useContext(StoreContext)

  const repoClient = useRepoClient({
    basePath: `${server}/api/v1/`,
    token: authentication?.token?.sha1,
  })

  const _setBooks = (value) => {
    setBooks(value)
    setRefresh(true)
    setCurrentLayout(null)
  }

  // monitor the refresh state and act when true
  useEffect(() => {
    async function getContent() {
      let _books = books
      let _ep = ep
      let _repoSuffix;
      if ( owner.toLowerCase() === 'unfoldingword' ) {
        if ( ltStState === LITERAL ) {
          _repoSuffix = '_ult'
        } else {
          _repoSuffix = '_ust'
        }
      } else {
        if ( ltStState === LITERAL ) {
          _repoSuffix = '_glt'
        } else {
          _repoSuffix = '_gst'
        }
      }
      const _repo = languageId + _repoSuffix
      for (let i=0; i<_books.length; i++) {
        if ( ! _books[i].content ) {
          let _content = null
          try {
            if ( _books[i].url ) {
              const response = await fetch(_books[i].url)
              const rawContent = await response.text()
              _content = {
                content: rawContent,
                encoding: 'plain',
              }
            } else {
              const _filename = usfmFilename(_books[ i ].bookId)
              // const _content = await repoClient.repoGetContents(
              //   owner,_repo,_filename
              // ).then(({ data }) => data)

              _content = await fetchFromUserBranch(
                owner,
                _repo,
                _filename,
                _books[ i ].bookId,
                authentication,
                repoClient
              )
            }
            _books[ i ].repo = _repo
          } catch (e) {
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
            _books[i].type = ltStState
            const _perf = usfm2perf(_usfmText)
            if ( _perf === null ) {
              _books[i].usfmText = null
              _books[i].content = "CONTENT IS NOT USABLE"
            } else {
              _books[i].perf = _perf
              const _docSetId = owner + "/" + _repo // captures org, lang, and type (literal or simplified)
              _books[i].docset = _docSetId
              if ( _ep[_docSetId] === undefined ) {
                console.log("creating Epitelete for doc set:", _docSetId)
                _ep[_docSetId] = new EpiteleteHtml({
                  proskomma: null,
                  docSetId: _docSetId,
                  options: { historySize: 100 }
                })
              }
              await _ep[_docSetId].sideloadPerf(_books[i].bookId.toUpperCase(), _books[i].perf)
              console.log("epitelete docset,books:", _docSetId,_ep[_docSetId].localBookCodes())
            }
          } else {
            _books[i].usfmText = null
          }
        }
      }
      setBooks(_books)
      setEp(_ep)
      console.log("setBooks():",_books)
      setRefresh(false)
      setLtStState('')
    }
    if ( ep && ltStState === LITERAL || ltStState === SIMPLIFIED ) {
      if (refresh && authentication && owner && server && languageId) {
        getContent()
      }
    } else {
      if (ep && ltStState === CUSTOM ) {
        getContent()
      }
    }
  }, [authentication, owner, server, languageId, refresh, books, ltStState, ep, setBooks, setLtStState, repoClient])


  // create the value for the context provider
  const context = {
    state: {
      books,
      ltStState,
      repoClient,
      ep,
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

