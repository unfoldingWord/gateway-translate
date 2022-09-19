import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useLocalStorage from '@hooks/useLocalStorage'
import { useRepoClient } from 'dcs-react-hooks';
import {usfmFilename} from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';

export const AppContext = React.createContext({});

export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useLocalStorage('books',[])
  const [refresh, setRefresh] = useState(true)
  const [reload, setReload] = useState(false)

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)
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
        if ( ! _books[i].content ) {
          const _filename = usfmFilename(_books[i].id)
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
          } else {
          _books[i].usfmText = null
          }
        }
      }
      setBooks(_books)
      setRefresh(false)
      setReload(true)
    }

    if (refresh && authentication && owner && server && languageId) {
      getContent()
    }
  }, [authentication, owner, server, languageId, refresh, books])


  // create the value for the context provider
  const context = {
    state: {
      books,
      reload,
    },
    actions: {
      setBooks: _setBooks,
      setReload,
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

