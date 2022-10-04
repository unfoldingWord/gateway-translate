import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProskomma } from "proskomma-react-hooks";
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'
import useEditorState from '../hooks/useEditorState';

export const AppContext = React.createContext({});

export default function AppContextProvider({children, ...props}) {

  const [books, setBooks] = useLocalStorage('gt-books',[])
  const [ltStState, setLtStState] = useLocalStorage('gt-LtSt', '')

  const verbose = true
  const pkHook = useProskomma({verbose})

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

  const _setBooks = (books) => {
    setBooks(books)
    setCurrentLayout(null)
  }

  // create the value for the context provider
  const context = {
    state: {
      ...editorState,
      books,
      ltStState,
      pkHook,
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

