import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'

import {ALL} from '@common/constants'

export const AppContext = React.createContext({});

export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useLocalStorage('books',[])

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
    setCurrentLayout(null)
  }

  // create the value for the context provider
  const context = {
    state: {
      books,
    },
    actions: {
      setBooks: _setBooks,
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

