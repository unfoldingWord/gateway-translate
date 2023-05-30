import {
  useContext,
  useEffect,
  useState,
} from 'react'
import { Workspace } from 'resource-workspace-rcl'
import makeStyles from '@mui/styles/makeStyles'

import { StoreContext } from '@context/StoreContext'
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
import { Card, useResourceClickListener } from 'translation-helps-rcl'

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
}))

function WorkspaceContainer() {
  const router = useRouter()
  const classes = useStyles()
  const [workspaceReady, setWorkspaceReady] = useState(false)
  const [networkError, setNetworkError] = useState(null)
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
    actions: {
      logout,
      setCurrentLayout,
      setTokenNetworkError,
      setLastError,
    },
  } = useContext(StoreContext)

  /**
   * in the case of a network error, process and display error dialog
   * @param {string} errorMessage - optional error message returned
   * @param {number} httpCode - http code returned
   */
  function processError(errorMessage, httpCode=0) {
    processNetworkError(errorMessage, httpCode, logout, router, setNetworkError, setLastError )
  }

  /**
   * show either tokenNetworkError or NetworkError for workspace
   * @return {JSX.Element|null}
   */
  function showNetworkError() {
    if (tokenNetworkError) { // if we had a token network error on startup
      if (!tokenNetworkError.router) { // needed for reload of page
        setTokenNetworkError({ ...tokenNetworkError, router }) // make sure router is set
      }
      return (
        <NetworkErrorPopup
          networkError={tokenNetworkError}
          setNetworkError={(error) => {
            setTokenNetworkError(error)
            setNetworkError(null) // clear this flag in case it was also set
          }}
          hideClose={true}
          onRetry={reloadApp}
        />
      )
    } else if (networkError) { // for all other workspace network errors
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
  function onResourceError(message, isAccessError, resourceStatus, error, showAllErrors = false) {
    if (!networkError ) { // only show if another error not already showing
      if (showAllErrors) {
        processNetworkError(error || message, resourceStatus, logout, router, setNetworkError, setLastError, setLastError)
      } else {
        if (isAccessError) { // we only show popup for access errors
          addNetworkDisconnectError(error || message, 0, logout, router, setNetworkError, setLastError)
        }
      }
    }
  }


  useEffect(() => {
    setWorkspaceReady(false)

    if (owner && languageId && appRef && server && loggedInUser) {
      setWorkspaceReady(true)
    }// eslint-disable-next-line
  }, [owner, languageId, appRef, server, loggedInUser])



  const config = {
    server,
    ...HTTP_CONFIG,
  }

  const titles = [
    'Title 1',
    'Title 2',
    'Title 3',
    'Title 4',
    'Title 5',
  ]

  const texts = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  ]

  return (
    (tokenNetworkError || networkError || !workspaceReady) ? // Do not render workspace until user logged in and we have user settings
      <>
        {showNetworkError()}
        <CircularProgress size={180} />
      </>
      :
      <Workspace
        rowHeight={25}
        layout={currentLayout}
        classes={classes}
        gridMargin={[10, 10]}
        onLayoutChange={(_layout, layouts) => {
          setCurrentLayout(layouts)
        }}
        layoutWidths={[
          [1, 1, 1],
          [2, 2, 2],
        ]}
        layoutHeights={[[10,10], [10, 10], [10, 10]]}
        minW={3}
        minH={4}
        breakpoints={{
          lg: 900,
          sm: 680,
          xs: 300,
        }}
        columns={{
          lg: 12,
          sm: 6,
          xs: 3,
        }}
      >
        {
          texts.map( (text,index) =>
            <Card title={titles[index]} classes={classes} hideMarkdownToggle={true} key={index}>
              <p style={{ padding: '30px' }}>
                {text}
              </p>
            </Card>,
          )
        }
      </Workspace>
  )
}

export default WorkspaceContainer
