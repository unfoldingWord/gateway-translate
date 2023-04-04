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
  const [networkError, setNetworkError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [idToClose, setIdToClose] = useState(null)


  const {
    state: { books },
    actions: { setBooks },
  } = useContext(AppContext)

  const onClose = id => {
    let _books = books
    setIdToClose(id)
    for (let i = 0; i < _books.length; i++) {
      if (_books[ i ].id === id) {
        if ( _books[ i ].unsaved === true ) {
          // alert("Changes are unsaved, re-open book to save")
          console.log("book has unsaved changes:", id)
          setShowModal(true)
        } else {
          _books[i].showCard = false
        }
        break
      }
    }
    setBooks(_books)
  }

  const removeBook = id => {
    let _books = books
    for (let i = 0; i < _books.length; i++) {
      if (_books[i].id === id) {
        _books[i].showCard = false;
        break
      }
    }

    setBooks(_books)
    setShowModal(false)
    setIdToClose(null)
  }

  const handleUsfmUpdate = (id, updatedUsfmText) => {
    const _books = books.map(book => {
      if (book.id === id) {
        return { ...book, usfmText: updatedUsfmText }
      }
      return book
    })
    setBooks(_books)
  }

  const {
    state: { currentLayout, tokenNetworkError, bibleReference },
    actions: { setCurrentLayout, setTokenNetworkError },
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


  const config = {
    server,
    ...HTTP_CONFIG,
  }

  return tokenNetworkError || networkError  ? (
    // ALWAYS render workspace
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
        {books.filter(data => data.bookId.toLowerCase() === bibleReference.bookId).map(data => (
          <ScriptureWorkspaceCard
            key={data.id}
            id={data.id}
            bookId={data.bookId}
            docSetId={data.docset}
            data={data}
            classes={classes}
            onClose={onClose}
          />
        ))}
      </Workspace>
      {books.map(data => ( 
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

// DCS CODE GRAVEYARD

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
// function onResourceError(
//   message,
//   isAccessError,
//   resourceStatus,
//   error,
//   showAllErrors = false
// ) {
//   if (!networkError) {
//     // only show if another error not already showing
//     if (showAllErrors) {
//       processNetworkError(
//         error || message,
//         resourceStatus,
//         logout,
//         router,
//         setNetworkError,
//         setLastError,
//         setLastError
//       )
//     } else {
//       if (isAccessError) {
//         // we only show popup for access errors
//         addNetworkDisconnectError(
//           error || message,
//           0,
//           logout,
//           router,
//           setNetworkError,
//           setLastError
//         )
//       }
//     }
//   }
// }

// const config = {
//   server,
//   ...HTTP_CONFIG,
// }

// const {
//   state: {
//     owner,
//     server,
//     appRef,
//     languageId,
//     loggedInUser,
//   },
//   actions: { logout setLastError },
// } = useStoreContext()
