import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'
import { useRepoClient } from 'dcs-react-hooks';
import {usfmFilename} from '@common/BooksOfTheBible'

export const AppContext = React.createContext({});

export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useLocalStorage('books',[])
  const [refresh, setRefresh] = useState(true)

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)
  console.log("authentication=",authentication)
  const repoClient = useRepoClient()

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
      let _repoSuffix = '_glt'
      if ( owner.toLowerCase() === 'unfoldingword' ) {
        _repoSuffix = '_ult'
      }
      const _repo = languageId + _repoSuffix
      for (let i=0; i<_books.length; i++) {
        console.log("getContent() processing:",_books[i])
        if ( ! _books[i].content ) {
          const _filename = usfmFilename(_books[i].id)
          const _content = await repoClient.repoGetContents(
            owner,_repo,_filename
          ).then(({ data }) => data)
          _books[i].content = _content
        }
      }
      setBooks(_books)
      console.log("getContent() _books", _books)
      setRefresh(false)
    }

    if (refresh && authentication && owner && server && languageId) {
      console.log("Entering getContent() languageId=", languageId)
      getContent()
    }
  }, [authentication, owner, server, languageId, refresh, books])


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

