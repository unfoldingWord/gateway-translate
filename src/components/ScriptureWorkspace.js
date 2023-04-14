import { useContext, useEffect, useState } from 'react'
//import useDeepEffect from 'use-deep-compare-effect';

import { Workspace } from 'resource-workspace-rcl'
import { makeStyles } from '@mui/styles'

import { AppContext } from '@context/AppContext'
import CircularProgress from '@components/CircularProgress'
import {
  addNetworkDisconnectError,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import { useRouter } from 'next/router'
import { useUnsavedDataState } from 'uw-editor'
import { HTTP_CONFIG } from '@common/constants'
import NetworkErrorPopup from '@components/NetworkErrorPopUp'
import ScriptureWorkspaceCard from './ScriptureWorkspaceCard'
import useStoreContext from '@hooks/useStoreContext'
import EmptyMessage from './EmptyMessage'
import UnsavedDataPopup from './UnsavedDataPopup'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: '0 1px !important',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  dragIndicator: {},
  label: {
    color: 'red',
  },
}))

function ScriptureWorkspace() {
  const router = useRouter()
  const classes = useStyles()
  const [workspaceReady, setWorkspaceReady] = useState(false)
  const [networkError, setNetworkError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [idToClose, setIdToClose] = useState(null)

  const {
    state: { books, ltStState },
    actions: { setBooks, setLtStState },
  } = useContext(AppContext)

  const { hasUnsavedData } = useUnsavedDataState( ) 

  const onClose = id => {
    let _books = [...books]
    const _trace = "ScriptureWorkspace.js/onClose()"
    setIdToClose(id)
    for (let i = 0; i < _books.length; i++) {
      if (_books[i].id === id) {
        if (hasUnsavedData(_books[i].docset,_books[i].bookId)) {
          // alert("Changes are unsaved, re-open book to save")
          console.log(_trace+": book has unsaved changes:", id)
          setShowModal(true)
        } else {   
          // found the book... now process it and break
          _books[i].showCard = false
          _books[i].trace = _trace
          console.log(_trace+": book is unchanged:", id)
          setBooks(_books)
        }
        break
      }
    }
  }

  const removeBook = id => {
    let _books = [...books]
    const _trace = "ScriptureWorkspace.js/removeBook()"
    for (let i = 0; i < _books.length; i++) {
      if (_books[i].id === id) {
        // found the book... now process it and break
        _books[i].showCard = false;
        _books[i].trace = _trace
        console.log(_trace+": remove card (showCard=false",id)
        setBooks(_books)
        setShowModal(false)
        setIdToClose(null)
        break
      }
    }
  }

  const {
    state: {
      owner,
      server,
      appRef,
      languageId,
      currentLayout,
      loggedInUser,
      tokenNetworkError,
    },
    actions: { logout, setCurrentLayout, setTokenNetworkError, setLastError },
  } = useStoreContext()

  /**
   * show either tokenNetworkError or NetworkError for workspace
   * @return {JSX.Element|null}
   */
  function showNetworkError() {
    if (tokenNetworkError) {
      // if we had a token network error on startup
      if (!tokenNetworkError.router) {
        // needed for reload of page
        setTokenNetworkError({ ...tokenNetworkError, router }) // make sure router is set
      }
      return (
        <NetworkErrorPopup
          networkError={tokenNetworkError}
          setNetworkError={error => {
            setTokenNetworkError(error)
            setNetworkError(null) // clear this flag in case it was also set
          }}
          hideClose={true}
          onRetry={reloadApp}
        />
      )
    } else if (networkError) {
      // for all other workspace network errors
      return (
        <NetworkErrorPopup
          networkError={networkError}
          setNetworkError={setNetworkError}
          onActionButton={onNetworkActionButton}
          hideClose={true}
          /* show reload if send feedback not enabled */
          onRetry={!networkError.actionButtonText ? reloadApp : null}
        />
      )
    }
    return null
  }

  /**
   * process error and determine if there is a problem with connection to server
   *  if showAnyError is true we display an error popup
   *    the process then is to check if this is server connection problem - if so we display that message, if not we display the error returned
   *  if showAnyError is false (default) we only display an error popup if there is a problem connecting to server
   * @param {string} message - the error message we received fetching a resource
   * @param {boolean} isAccessError - if false then the error type is not one that would be caused by server connection problems
   * @param {number} resourceStatus - status code returned fetching resource
   * @param {object} error - error object for detected error, could be a parsing error, etc.  This will take precedence over message
   * @param {boolean} showAllErrors - if true then always show a popup error message, otherwise just show server error message if we can't talk to server
   */
  function onResourceError(
    message,
    isAccessError,
    resourceStatus,
    error,
    showAllErrors = false
  ) {
    if (!networkError) {
      // only show if another error not already showing
      if (showAllErrors) {
        processNetworkError(
          error || message,
          resourceStatus,
          logout,
          router,
          setNetworkError,
          setLastError,
          setLastError
        )
      } else {
        if (isAccessError) {
          // we only show popup for access errors
          addNetworkDisconnectError(
            error || message,
            0,
            logout,
            router,
            setNetworkError,
            setLastError
          )
        }
      }
    }
  }

  useEffect(() => {
    setWorkspaceReady(false)

    if (owner && languageId && appRef && server && loggedInUser) {
      // clearCaches()
      setWorkspaceReady(true)
    } // eslint-disable-next-line
  }, [owner, languageId, appRef, server, loggedInUser])

  const config = {
    server,
    ...HTTP_CONFIG,
  }

  return tokenNetworkError || networkError || !workspaceReady ? (
    // Do not render workspace until user logged in and we have user settings
    <>
      {showNetworkError()}
      <CircularProgress size={180} />
    </>
  ) : !!books.filter( b => b.showCard).length ? (
    <>
      <Workspace
        layout={currentLayout}
        classes={classes}
        gridMargin={[10, 10]}
        onLayoutChange={(_layout, layouts) => {
          setCurrentLayout(layouts)
        }}
        minW={2}
        minH={1}
        rowHeight={25}
        layoutWidths={[
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
        ]}
        layoutHeights={[
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
          [20, 20],
        ]}
      >
        {books.filter( b => b.showCard ).map(data => (
          <ScriptureWorkspaceCard
            key={data.id}
            id={data.id}
            bookId={data.bookId}
            docSetId={data.docset}
            data={data}
            classes={classes}
            onClose={() => onClose(data.id)}
            unSavedData={hasUnsavedData(data.docset,data.bookId)}
          />
        ))}
      </Workspace>
      {books.filter( b => b.id === idToClose ).map(data => ( 
        data.id === idToClose &&
        <UnsavedDataPopup
          key={data.id}
          id={data.id}
          bookId={data.bookId}
          showModal={showModal}
          setShowModal={setShowModal}
          onDiscard={() => removeBook(data.id)}
        />
      ))}
    </>
  ) : (
    <EmptyMessage
      sx={{ color: 'text.disabled' }}
      message={'No books to display, please add a new book.'}
    ></EmptyMessage>


  )
}

export default ScriptureWorkspace
