/**
@module
@description
This module is used to create and manage global state for the application.
*/

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
    */
    const newBibleBookSourceId = "new-Biblebook" 
    /*
      Noah: `_bibleRef` is only creating a soft copy of bibleReference in which
      code below will modify both _bibleRef and bibleReference.
      Is that what you intended to do? If so could we remove the
      _bibleRef variable and use bibleReference instead to make this more apparent?

      Lars:
      bibleReference is a React state variable, which can only be set through setBibleReference.
      - in _bibleReference each key can be set directly
      - and at the end setBibleReference is called

      Noah: 
        According to https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax
        we should be creating a copy of bibleReference.

        const _bibleRef = bibleReference

        is only creating a pointer copy of bibleReference.
        @Lars could you run a test on this?
    */
    const _bibleRef = {...bibleReference}
    _bibleRef.sourceId = newBibleBookSourceId
    if (_bibleRef?.bookId?.toUpperCase() !== bId?.toUpperCase()) {
      _bibleRef.bookId = bId?.toUpperCase()
      _bibleRef.chapter = "1"
      _bibleRef.verse = "1"
    }
    bRefActions.applyBooksFilter([bId?.toLowerCase()])
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
