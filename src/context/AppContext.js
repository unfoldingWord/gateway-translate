import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'
import {usfmFilename} from '@common/BooksOfTheBible'
import { LITERAL, SIMPLIFIED } from '@common/constants'

import useEditorState from '../hooks/useEditorState';

const urlDocument = ({ server, selectors, bookCode, bookName, filename, ...props}) => ({
  selectors,
  bookCode,
  chapter: 1,
  url: `${server}/${selectors.org}/${selectors.lang}_${selectors.abbr}/raw/branch/master/${filename}`,
});

export const AppContext = React.createContext({});

export default function AppContextProvider({children, ...props}) {

  const [books, setBooks] = useLocalStorage('gt-books',[])
  const [ltStState, setLtStState] = useLocalStorage('gt-LtSt', '')
  const [refresh, setRefresh] = useState(true)

  const { 
    state: editorState, 
    actions: editorActions 
  } = useEditorState({...props});

  const { pkDocuments } = editorState
  const { setPkDocuments } = editorActions

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
      let _pkDocuments = pkDocuments
      let abbr;
      const org = owner
      if ( org === 'unfoldingWord' ) {
        if ( ltStState === LITERAL ) {
          abbr = 'ult'
        } else {
          abbr = 'ust'
        }
      } else {
        if ( ltStState === LITERAL ) {
          abbr = 'glt'
        } else {
          abbr = 'gst'
        }
      }
      for (let i=0; i<books.length; i++) {
        if ( ! _pkDocuments[i] ) {
          const filename = usfmFilename(books[i].bookId)
          const _document = urlDocument({
            server,
            selectors: { org, lang: languageId, abbr },
            bookCode: books[i].bookId, 
            filename,
          })
          _pkDocuments[i] = {..._document }
        }
      }
      setPkDocuments(_pkDocuments)
      setRefresh(false)
      setLtStState('')
    }
    if ( ltStState === LITERAL || ltStState === SIMPLIFIED ) {
      if (refresh && authentication && owner && server && languageId) {
        getContent()
      }
    }
  }, [authentication, owner, server, languageId, refresh, books, ltStState, setBooks, setLtStState, setPkDocuments ])


  // create the value for the context provider
  const context = {
    state: {
      ...editorState,
      books,
      ltStState,
    },
    actions: { 
      ...editorActions,
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

