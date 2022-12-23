import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@hooks/useLocalStorage'
import { AuthContext } from '@context/AuthContext'
import useSaveChangesPrompt from '@hooks/useSaveChangesPrompt'

export const StoreContext = createContext({})
export default function StoreContextProvider(props) {
  const {
    state: { networkError: tokenNetworkError, server },
    actions: { setNetworkError: setTokenNetworkError, setServer },
  } = useContext(AuthContext)

  const [mainScreenRef, setMainScreenRef] = useState(null)
  const [lastError, setLastError] = useState(null)
  const [owner, setOwner] = useLocalStorage('owner', '')
  const [languageId, setLanguageId] = useLocalStorage('languageId', '')
  const [taArticle, setTaArticle] = useState(null)
  const [selectedQuote, setQuote] = useLocalStorage('selectedQuote', null)
  // TODO blm: for now we use unfoldingWord for original language bibles
  const [scriptureOwner, setScriptureOwner] = useState('unfoldingWord')
  const [appRef, setAppRef] = useLocalStorage('appRef', 'master') // default for app
  const [bibleReference, setBibleReference] = useLocalStorage(
    'bibleReference',
    {
      bookId: 'mat',
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
  const [currentLayout, setCurrentLayout] = useLocalStorage(
    'resourceLayout',
    null
  )

  const {
    savedChanges,
    setSavedChanges,
    checkUnsavedChanges,
    showSaveChangesPrompt,
  } = useSaveChangesPrompt()

  function onReferenceChange(bookId, chapter, verse) {
    setQuote(null)
    setBibleReference(prevState => ({
      ...prevState,
      bookId,
      chapter,
      verse,
    }))
  }

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
      // AUTH: authentication,
      // AUTH: loggedInUser: username,
      lastError,
      tokenNetworkError,
      greekRepoUrl,
      hebrewRepoUrl,
      mainScreenRef,
      savedChanges,
    },
    actions: {
      // AUTH: logout,
      onReferenceChange,
      setScriptureOwner,
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
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreContextProvider.propTypes = { children: PropTypes.object }

/*
 * AUTH CODE GRAVEYARD
    const {
      state: { authentication, networkError: tokenNetworkError, server },
      actions: { logout, setNetworkError: setTokenNetworkError, setServer },
    } = useContext(AuthContext)
    const username = authentication?.user?.username || ''

    import * as useULS from '@hooks/useUserLocalStorage'

    function useUserLocalStorage(key, initialValue) {
     return useULS.useUserLocalStorage('', key, initialValue)
     }
 */
