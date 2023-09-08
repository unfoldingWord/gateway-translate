import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@hooks/useLocalStorage'
import * as useULS from '@hooks/useUserLocalStorage'
import { AuthContext } from '@context/AuthContext'
import useSaveChangesPrompt from '@hooks/useSaveChangesPrompt'
import { useBibleReference } from 'bible-reference-rcl'
import { FIRST_NT_BIBLEBOOK } from '@common/constants'

export const StoreContext = createContext({})
export default function StoreContextProvider(props) {
  const {
    state: { authentication, networkError: tokenNetworkError, server },
    actions: { logout, setNetworkError: setTokenNetworkError, setServer },
  } = useContext(AuthContext)
  const username = authentication?.user?.username || ''

  /**
   * wrapper for useULS.useUserLocalStorage that applies current username
   * @param {string} key
   * @param {any} initialValue
   * @return {any[]}
   */
  function useUserLocalStorage(key, initialValue) {
    return useULS.useUserLocalStorage(username, key, initialValue)
  }

  const [mainScreenRef, setMainScreenRef] = useState(null)
  const [lastError, setLastError] = useState(null)
  const [owner, setOwner] = useUserLocalStorage('owner', '')
  const [languageId, setLanguageId] = useUserLocalStorage('languageId', '')
  const [showAccountSetup, setShowAccountSetup] = useLocalStorage(
    'showAccountSetup',
    true
  )
  const [taArticle, setTaArticle] = useState(null)
  const [selectedQuote, setQuote] = useUserLocalStorage('selectedQuote', null)
  // TODO blm: for now we use unfoldingWord for original language bibles
  const [scriptureOwner, setScriptureOwner] = useState('unfoldingWord')
  const [appRef, setAppRef] = useUserLocalStorage('appRef', 'master') // default for app
  let cacheBRef = {}
  const [bibleReference, localSetBibleReference] = useUserLocalStorage(
    'bibleReference',
    {
      bookId: FIRST_NT_BIBLEBOOK,
      chapter: '1',
      verse: '1',
    }
  )

  const [greekRepoUrl, setGreekRepoUrl] = useLocalStorage('greekRepoUrl', null)
  const [hebrewRepoUrl, setHebrewRepoUrl] = useLocalStorage(
    'hebrewRepoUrl',
    null
  )
  const [supportedBibles, setSupportedBibles] = useLocalStorage('bibles', [])
  const [currentLayout, setCurrentLayout] = useUserLocalStorage(
    'resourceLayout',
    null
  )

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

  // This changes the bibleReference and set it to the first chapter and verse 
  // of a new Bible book (bId)
  //Noah: is the the bibleReference of the entire app or just a particular card/editor pane?
  const setNewBibleBook = (bId) => { 
    // This (somewhat meaningful) below ID string is used as a means to differentiate changes coming from editor panes, which are calculated unique IDs
    /*
      Noah: I'm not sure I follow; I have a few more questions:
      * How is the sourceId generated?
      * If you're manually setting the sourceId here will this sourceId be updated in the future?
      * Does this ID need to be unique (what happens if this hook is called multiple times?)

      Lars: 
        The sourceId is for other cases generated for each Edito Pane, each having
        its own unique ID. In this case there is a need to have a manually
        unique ID, different from the automatically generated unique IDs
    */
    const newBibleBookSourceId = "new-Biblebook" 
    /*
      Noah: `_bibleRef` is only creating a soft copy of bibleReference in which
      code below will modify both _bibleRef and bibleReference.
      Is that what you intended to do? If so could we remove the
      _bibleRef variable and use bibleReference instead to make this more apparent?
    */
    const _bibleRef = bibleReference
    _bibleRef.sourceId = newBibleBookSourceId
    if (_bibleRef?.bookId?.toUpperCase() !== bId?.toUpperCase()) {
      _bibleRef.bookId = bId?.toUpperCase()
      _bibleRef.chapter = "1"
      _bibleRef.verse = "1"
    }
    /* 
      Lars:
      bibleReference is a React state variable, which can only be set through setBibleReference.
      - in _bibleReference each key can be set directly
      - and at the end setBibleReference is called
    */
    bRefActions.applyBooksFilter([bId?.toLowerCase()])
    /*
      Noah:
        Can we get rid of .toString() since it seems redundant?

      Lars:
        Since we are using an RCL here, which I have not taken the time to improve,
        we have had errors happening, due to chapter and verse not having the right
        type. So this here is just safeguarding against this - due to that chapter and
        verse might be coming in through the current bibleReference state. In other
        words, until the bible-reference-rcl has ben fixed (the right place to safe
        guard), then I prefer to safe guard here - based on previous experience...

      Noah:
        Which RCL are you referring to? translation-helps-rcl?

        What are the other possible values could chapter be? My main concern here
        is that, for example chapter, could be null (as per the ? syntax) in which
        case does goToBookChapterVerse have well defined behavior for every combination
        of arguments:

          goToBookChapterVerse(null, null, null)
          goToBookChapterVerse(<some-id>, null, null)
          goToBookChapterVerse(<some-id>, object, null)
          ...

        So even having `chapter?.toString()` only solves the problem where chapter could be
        a String object (and maybe not even a valid chapter string, e.g: "adf")

        I would suggest writing a parser (I'll explain below) for the _bibleRef data. Said parser
        should be written as close to where that data is being fetched and any assumptions
        about what to do when data is missing etc. should be handled there.

        By a parser I don't mean a parser that parses from a string but from any "raw" data (e.g
        JSON returned from an API call etc.). The idea is that instead of validating data further
        down the call chain, you parse the data for all the assumptions the code needs to make
        and then at points like this you only need to thread the valid data around.
        There's a great article on this[^1].

        [^1]: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/

        PS: I realize I'm being a bit preachy and long winded here but I think this note could
        be useful for other team members.

      Lars:
        As already mentioned, the RCL is bible-reference-rcl and I would very much like to have 
        that RCL refactored and including what you mention here above.
        Right now we need to get gT to QA and also I don't think that gT would be the right place
        to implement this.

        I actually also do not know how to add this as an issue to bible-reference-rcl, in such 
        a way that it later on will be seen and dealt with. But I think that is what you could do.
        Seems good to mention this at next stand-up.

        As for now, I suggest we leave gT with such additional (maybe unneeded) safe-guarding

    */
    bRefActions.goToBookChapterVerse(bId?.toLowerCase(), _bibleRef?.chapter?.toString(), _bibleRef?.verse?.toString())
    setBibleReference(_bibleRef)
  }

  const {
    savedChanges,
    setSavedChanges,
    checkUnsavedChanges,
    showSaveChangesPrompt,
  } = useSaveChangesPrompt()

  function updateTaDetails(supportReference) {
    if (typeof supportReference === 'string') {
      const path = supportReference?.replace('rc://*/ta/man/', '')
      const split = path.split('/')

      setTaArticle({
        projectId: split.length > 1 ? split[0] : 'translate',
        filePath: `${split[1] || split[0]}/01.md`,
      })
    } else {
      setTaArticle(null)
    }
  }

  const value = {
    state: {
      showAccountSetup,
      scriptureOwner,
      bibleReference,
      selectedQuote,
      languageId,
      taArticle,
      server,
      appRef,
      owner,
      supportedBibles,
      currentLayout,
      useUserLocalStorage,
      loggedInUser: username,
      authentication,
      lastError,
      tokenNetworkError,
      greekRepoUrl,
      hebrewRepoUrl,
      mainScreenRef,
      savedChanges,
    },
    actions: {
      logout,
      setShowAccountSetup,
      setScriptureOwner,
      setBibleReference,
      setNewBibleBook,
      setLanguageId,
      setAppRef,
      setServer,
      setQuote,
      setOwner,
      setSupportedBibles,
      setCurrentLayout,
      setLastError,
      setTokenNetworkError,
      updateTaDetails,
      setGreekRepoUrl,
      setHebrewRepoUrl,
      setMainScreenRef,
      setSavedChanges,
      checkUnsavedChanges,
      showSaveChangesPrompt,
      
    },
    bRefState,
    bRefActions
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreContextProvider.propTypes = { children: PropTypes.object }
