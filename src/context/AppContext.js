import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { RepositoryApi, OrganizationApi } from 'dcs-js';
import {usfmFilename} from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';
import { FIRST_NT_BIBLEBOOK } from '@common/constants';
import { fetchFromUserBranch } from '@utils/fetchFromUserBranch';
import { randomLetters } from '@utils/randomLetters';
import { useBibleReference } from 'bible-reference-rcl'

export const AppContext = React.createContext({});


export default function AppContextProvider({
  children,
}) {

  const [books, setBooks] = useState([])
  const [hasOpenBook,setHasOpenBook] = useState(false)
  const [focusedBookParams,setFocusedBookParams] = useState({})
  const [alreadyOpenNotice, setAlreadyOpenNotice] = useState(false)
  const [ltStState, setLtStState] = useState('')
  const [refresh, setRefresh] = useState(true)
  const [repoClient, setRepoClient] = useState(null)
  const [organizationClient, setOrganizationClient] = useState(null)
  let cacheBRef = {}
  // ToDo - LG: setting this state seems to sometimes cause a warning: 
  // Cannot update a component (`StoreContextProvider`) while rendering a different component (`EditorContainer`).
  const [bibleReference, localSetBibleReference] = useState(
    {
      bookId: FIRST_NT_BIBLEBOOK,
      chapter: '1',
      verse: '1',
    }
  )

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

  const getApiConfig = ({ token, basePath = "https://qa.door43.org/api/v1/" }) => ({
    apiKey: token && ((key) => key === "Authorization" ? `token ${token}` : ""),
    basePath: basePath?.replace(/\/+$/, ""),
  })

  useEffect(
    () => {
      if ( authentication && authentication?.token ) {
          const _configuration = getApiConfig({ token: authentication.token.sha1, basePath:`${server}/api/v1/` });
          setRepoClient(new RepositoryApi(_configuration))
          setOrganizationClient(new OrganizationApi(_configuration))
      }
    },[authentication, server]
  )

  const _setBooks = (value) => {
    const _hasOpenBook = (value?.filter( b => b.showCard )?.length>0)
    setHasOpenBook(_hasOpenBook)
    setBooks(value)
    setRefresh(true)
    setCurrentLayout(null)
  }

  /* 
    This changes the bibleReference (reminder: there's only one for the entire application) 
    and sets it to the first chapter and verse of a new Bible book (bId).
  */
  const setNewBibleBook = (bId) => { 
    /*
      Lars (cleaned up by Noah):
        The bibleReference.sourceId is for other cases generated for each editor pane, each having
        its own unique ID. For setNewBibleBook to work there is a need to have a manually
        unique ID, different from the automatically generated unique IDs

      Noah:
        What's the need you speak of here?

      Lars:
        There is quite a bit of "hidden" communication going on, by using this sourceId 
        - this makes it possible to filter out what bcvReference change to ignore and which to act on.
        This is needed in three or more places, for example in two or more Editor panes
        when they are dealing with the same Bible book + adjusting the Bible navigation UI
        in the app bar. All of these have to filter in different ways in order for all of 
        this to be intuitive to use. Such filtering is often based on this sourceId.
    */
    const newBibleBookSourceId = "new-Biblebook" 
    const _bibleRef = {...bibleReference}
    _bibleRef.sourceId = newBibleBookSourceId
    if (_bibleRef?.bookId?.toUpperCase() !== bId?.toUpperCase()) {
      _bibleRef.bookId = bId?.toUpperCase()
      _bibleRef.chapter = "1"
      _bibleRef.verse = "1"
    }
    /*
      TODO:
        bible-reference-rcl is where the code exists for constructing the bibleReference data.
        And we need to add parsing that data so that gT and other apps don't have to manually
        perfom runtime checks everytime they wish to consume a bibleReference. For now, however,
        we are left to such hacks as .toString(). 
    */
    bRefActions.goToBookChapterVerse(bId?.toLowerCase(), _bibleRef?.chapter?.toString(), _bibleRef?.verse?.toString())
    setBibleReference(_bibleRef)
  }
  
  const addNewBookIfNotExists = (entry) => {
    let _hasOpenBook = false
    setBooks(prevBooks => {
      _hasOpenBook = (prevBooks?.filter( b => b.showCard )?.length>0)
      const nextBooks = [...prevBooks]
      let found = -1
      let showCardChange = false
      for (let i=0; i<nextBooks.length; i++) {
        if ( nextBooks[i].id === entry.id ) {
          if ( nextBooks[i].showCard ) {
            found = i
          } else { 
            if (nextBooks[i]?.showCard === false ) {
              found = i 
              nextBooks[i].showCard = true
              _hasOpenBook = true
              showCardChange = true
            }
          }
          break
        }
      }
      console.log(entry)
      if ( found > -1 ) {
        if ( showCardChange ) {
          return nextBooks // update to reflect change above
        } else {
          console.log('message!!!')
          setAlreadyOpenNotice(true)
        }
      } else {
        _hasOpenBook = true
        console.log([...nextBooks, entry])
        setFocusedBookParams(entry)
        return [...nextBooks, entry]
      }
      return nextBooks
    })
    setHasOpenBook(_hasOpenBook)
    setRefresh(true)
    setCurrentLayout(null)
  }

  const onBibleRefUIChange = (bId, ch, v) => {
    const bRefId = "BibleRef"
    if (cacheBRef 
      && (cacheBRef?.bookId?.toUpperCase() === bId?.toUpperCase())
      && (cacheBRef.chapter === ch) 
      && (cacheBRef.verse === v)) { // suppress cached external updates
        cacheBRef = {}
    } else if ((bibleReference?.bookId !== bId?.toUpperCase()) 
      || (bibleReference.chapter !== ch) 
      || (bibleReference.verse !== v)) { // Do not re-trigger new events
        localSetBibleReference({ sourceId: bRefId, bookId: bId.toUpperCase(), chapter: ch, verse: v })
        if (bibleReference?.bookId !== bId?.toUpperCase()) {
          const dcsObj = focusedBookParams
          console.log(dcsObj)
          if (dcsObj && dcsObj?.source === "dcs") {
            bRefActions.applyBooksFilter(dcsObj.availableBooks)
            // Create a copy of the current dcs object - but with a new bookId
            const newBookObj = {
              repo: dcsObj.repo,
              availableBooks: dcsObj.availableBooks,
              owner: dcsObj.owner,
              languageId: dcsObj.languageId,
              readOnly: dcsObj.readOnly,
              bookId: bId?.toLowerCase(),
              source: dcsObj.source,
              content: null, 
              showCard: true,
              id: `${bId?.toLowerCase()}-${dcsObj.repo}-${dcsObj.owner}`,
            }
            console.log("onBibleRefUIChange 2")
            console.log(newBookObj)
            addNewBookIfNotExists(newBookObj)
          }
          setNewBibleBook(bId)
        }
    }
  }

  const { state: bRefState, actions: bRefActions } = useBibleReference({
    initialBook: FIRST_NT_BIBLEBOOK,
    initialChapter: '1',
    initialVerse: '1',
    onChange: (bId, ch, v) => onBibleRefUIChange(bId, ch, v),
    // onPreChange: () => checkUnsavedChanges(),
    onPreChange: (bId, ch, v, p4) => true,
  })

  const setBibleReference = (obj) => {
    cacheBRef = obj // suppress cached external updates
    localSetBibleReference(obj)
  }

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
                const _filename = usfmFilename(_books[ i ].bookId)
                // const _content = await repoClient.repoGetContents(
                //   owner,_repo,_filename
                // ).then(({ data }) => data)
                console.log(_books[ i ].bookId)

                _content = await fetchFromUserBranch(
                  _books[ i ].owner,
                  _books[ i ].repo,
                  _filename,
                  _books[ i ].bookId,
                  authentication,
                  repoClient
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
  }, [authentication, owner, server, languageId, refresh, books, setBooks, repoClient])


  // create the value for the context provider
  const context = {
    state: {
      bibleReference,
      books,
      focusedBookParams,
      alreadyOpenNotice,
      hasOpenBook,
      ltStState,
      repoClient,
      organizationClient,
    },
    actions: {
      setBibleReference,
      setFocusedBookParams,
      setNewBibleBook,
      setAlreadyOpenNotice,
      setBooks: _setBooks,
      setLtStState,
      addNewBookIfNotExists,
    },
    bRefState,
    bRefActions
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
