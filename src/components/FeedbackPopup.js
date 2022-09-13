import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { DraggableCard } from 'translation-helps-rcl'
import FeedbackCard from '@components/FeedbackCard'

// draggable popup for sending feedback
const FeedbackPopup = ({
  owner,
  server,
  branch,
  taArticle,
  languageId,
  selectedQuote,
  scriptureOwner,
  bibleReference,
  supportedBibles,
  currentLayout,
  lastError,
  loggedInUser,
  onClose,
  mainScreenRef,
  open,
}) => {
  const [updateBounds, setUpdateBounds] = useState(0)
  const [initCard, setInitCard] = useState(false)

  /**
   * update bounds calculations
   */
  function doUpdateBounds() {
    if (open) {
      setUpdateBounds(updateBounds + 1)
    }
  }

  useEffect(() => {
    doUpdateBounds() // update bounds calculations after render

    if (open) {
      setInitCard(true)
    }
  }, [open])

  const feedbackParams = {
    open,
    owner,
    server,
    branch,
    taArticle,
    languageId,
    selectedQuote,
    scriptureOwner,
    bibleReference,
    supportedBibles,
    currentLayout,
    lastError,
    loggedInUser,
    initCard,
    setInitCard,
    onClose,
  }

  return (
    <DraggableCard
      open={open}
      showRawContent
      initialPosition={{ x: 0, y: -10 }}
      workspaceRef={mainScreenRef}
      onClose={onClose}
      dimBackground={true}
      content={
        <FeedbackCard
          {...feedbackParams}
        />
      }
    />
  )
}

FeedbackPopup.propTypes = {
  owner: PropTypes.string,
  server: PropTypes.string,
  branch: PropTypes.string,
  taArticle: PropTypes.object,
  languageId: PropTypes.string,
  selectedQuote: PropTypes.object,
  scriptureOwner: PropTypes.string,
  bibleReference: PropTypes.object,
  supportedBibles: PropTypes.array,
  currentLayout: PropTypes.object,
  lastError: PropTypes.object,
  loggedInUser: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  /** Optional, used to make sure draggable card is contained within workspace */
  mainScreenRef: PropTypes.object,
  /** to open or close the feedback card */
  open: PropTypes.bool,
}

export default FeedbackPopup
