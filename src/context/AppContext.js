import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProskomma, useImport, useCatalog } from "proskomma-react-hooks";
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'
import { useRepoClient } from 'dcs-react-hooks';
import { usfmFilename } from '@common/BooksOfTheBible'
import useEditorState from '../hooks/useEditorState';
import { LITERAL, SIMPLIFIED } from '@common/constants';

const pkDocuments = [
  { 
    selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ult' },
    bookCode: 'tit',
    chapter: 1,
    url: 'https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/57-TIT.usfm',
  },
  { 
    selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ust' },
    bookCode: 'tit',
    chapter: 1,
    url: 'https://git.door43.org/unfoldingWord/en_ust/raw/branch/master/57-TIT.usfm',
  },
];

export const AppContext = React.createContext({});

export default function AppContextProvider({children, ...props}) {

  const [books, setBooks] = useLocalStorage('gt-books',[])
  const [ltStState, setLtStState] = useLocalStorage('gt-LtSt', '')
  const [refresh, setRefresh] = useState(true)
  const [pkCatalog, setPkCatalog] = useState({})

  const repoClient = useRepoClient()
  const verbose = true
  const pkHook = useProskomma({verbose})

  const { proskomma, stateId, newStateId } = pkHook;
  
  const { done } = useImport({ proskomma, stateId, newStateId, documents: pkDocuments });

  const { catalog } = useCatalog({ proskomma, stateId, verbose });

  useEffect(() => {
    // Set new catalog value in global state
    setPkCatalog(catalog)  
  }, [catalog] )

  const { 
    state: editorState, 
    actions: editorActions 
  } = useEditorState({...props});

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

  const _setBooks = (value) => {
    setBooks(value)
    setRefresh(true)
    setCurrentLayout(null)
  }

  // monitor the refresh state and act when true
  useEffect(() => {
    async function getContent() {
      let _books = books
      let _repoSuffix;
      if ( owner.toLowerCase() === 'unfoldingword' ) {
        if ( ltStState === LITERAL ) {
          _repoSuffix = 'ult'
        } else {
          _repoSuffix = 'ust'
        }
      } else {
        if ( ltStState === LITERAL ) {
          _repoSuffix = 'glt'
        } else {
          _repoSuffix = 'gst'
        }
      }
      const _repo = languageId + '_' + _repoSuffix
      for (let i=0; i<_books.length; i++) {
        if ( ! _books[i].content ) {
          _books[i].content = {} // Dummy - for testing
/*
          const _filename = usfmFilename(_books[i].bookId)
          const _content = await repoClient.repoGetContents(
            owner,_repo,_filename
          ).then(({ data }) => data)
          _books[i].content = _content
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
          } else {
            _books[i].usfmText = null
          }
*/          
          _books[i].selectors = { org: owner, lang: languageId, abbr: _repoSuffix }
          _books[i].filename = usfmFilename(_books[i].bookId)
          _books[i].server = server
console.log(_books[i])
        }
      }
      setBooks(_books)
      setRefresh(false)
      setLtStState('')
    }
    if ( ltStState === LITERAL || ltStState === SIMPLIFIED ) {
      if (refresh && authentication && owner && server && languageId) {
        getContent()
      }
    }
  }, [authentication, owner, server, languageId, refresh, books, ltStState, setBooks, setLtStState, repoClient])

  // create the value for the context provider
  const context = {
    state: {
      ...editorState,
      books,
      ltStState,
      pkHook,
      pkCatalog,
    },
    actions: { 
      ...editorActions,
      setBooks: _setBooks,
      setLtStState,
      setPkCatalog,
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

