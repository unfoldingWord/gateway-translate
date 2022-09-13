import { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import MuiAlert from '@material-ui/lab/Alert'
import { getBuildId } from '@utils/build'
import { getLocalStorageItem, getUserKey } from '@hooks/useUserLocalStorage'
import { processNetworkError } from '@utils/network'
import { CLOSE, HTTP_GET_MAX_WAIT_TIME } from '@common/constants'
import NetworkErrorPopup from '@components/NetworkErrorPopUp'
import PropTypes from 'prop-types'
import useFeedbackData from '@hooks/useFeedbackData'

// FeedbackCard.js renders feedback content that is placed in FeedbackPopup

/**
 * show message bar with alert
 * @param {string} severity
 * @param {string} message
 * @param {function} onClick - action for OK button
 * @return {JSX.Element}
 * @constructor
 */
function Alert({
  severity,
  message,
  onClick,
}) {
  return (
    <MuiAlert
      className='w-full mt-8 mb-4'
      elevation={6}
      variant='filled'
      severity={severity}
      action={
        severity === 'success' && (
          <Button color='inherit' size='small' onClick={() => onClick && onClick()}>
            OK
          </Button>
        )
      }
    >
      {message}
    </MuiAlert>
  )
}

Alert.propTypes = {
  // type of the alert, selects the color
  severity: PropTypes.string.isRequired,
  // text to display on alert
  message: PropTypes.string.isRequired,
  // optional action for button click
  onClick: PropTypes.func,
}

const useStyles = makeStyles(theme => ({
  textField: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(4),
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const helperTextStyles = makeStyles(() => ({ root: { color: 'red' } }))

const FeedbackCard = ({
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
}) => {
  const classes = useStyles()
  const helperTestClasses = helperTextStyles()
  const categories = ['Bug Report', 'Feedback']
  const emailEditRef = useRef(null)
  const { state, actions } = useFeedbackData(open)

  useEffect(() => {
    if (initCard) {
      actions.clearState()
      setInitCard(false) // card initialized
    }
  }, [initCard])

  /**
   * in the case of a network error, process and display error dialog
   * @param {string|Error} error - initial error message message or object
   * @param {number} httpCode - http code returned
   */
  function processError(error, httpCode=0) {
    processNetworkError(error, httpCode, null, null, actions.setNetworkError, null, null )
  }

  function onCategoryChange(e) {
    actions.setCategory(e.target.value)
  }

  function onNameChange(e) {
    actions.setName(e.target.value)
  }

  function onEmailChange(e) {
    const validationError = e?.target?.validationMessage || null
    actions.setEmailError(validationError)

    if (!validationError) { // if email address error corrected, then clear any displayed warning
      actions.setShowEmailError(false)
    }
    actions.setEmail(e.target.value)
  }

  function onMessageChange(e) {
    actions.setMessage(e.target.value)
  }

  function getUserSettings(username, baseKey) {
    const key = getUserKey(username, baseKey)
    const savedValue = getLocalStorageItem(key)
    return savedValue
  }

  function getScriptureCardSettings(username) {
    const settings = ['scripturePaneTarget', 'scripturePaneConfig', 'scripturePaneFontSize']
    const cards = []

    for (let i = 0; ; i++) {
      const cardSettings = {}

      for (let j = 0; j < settings.length; j++) {
        const settingKey = settings[j]
        const savedValue = getUserSettings(username, `${settingKey}_${i}`)

        if (savedValue !== null) {
          cardSettings.settingKey = savedValue
        } else {
          break
        }
      }

      if (Object.keys(cardSettings).length > 0) {
        cards.push(cardSettings)
      } else {
        break
      }
    }
    return cards
  }

  function getHelpsCardSettings(username) {
    const helpsCards = ['tn', 'ta', 'twl', 'twa', 'tq']
    const helpsCardRefSettings = helpsCards.map(card => (`resource_card_${card}_ref`))
    const helpsCardFilterSettings = helpsCards.map(card => (`filters_resource_card_${card}`))
    const helpsCardHeadersSettings = helpsCards.map(card => (`headers_resource_card_${card}`))
    const helpsCardMarkdownSettings = helpsCards.map(card => (`markdownViewresource_card_${card}`))
    const helpsCardEditingSettings = helpsCards.map(card => (`editing_resource_card_${card}_${languageId}`))
    const settingsReadList = [
      ...helpsCardRefSettings,
      ...helpsCardFilterSettings,
      ...helpsCardHeadersSettings,
      ...helpsCardMarkdownSettings,
      ...helpsCardEditingSettings,
    ]
    const currentSettings = {}

    for (let i = 0; i < settingsReadList.length; i++) {
      const settingKey = settingsReadList[i]
      const savedValue = getUserSettings(username, settingKey)

      if (savedValue !== null) {
        currentSettings[settingKey] = savedValue
      }
    }
    return currentSettings
  }

  async function onSubmitFeedback() {
    actions.setShowSuccess(false)

    if (state.emailError) { // if there is currently an error on the email address, show to user and abort submitting feedback
      actions.setShowEmailError(true)
      emailEditRef.current.focus()
      return
    }

    actions.setSubmitting(true)
    actions.setShowError(false)
    const build = getBuildId()
    const scriptureCardSettings = getScriptureCardSettings(loggedInUser)
    const helpsCardSettings = getHelpsCardSettings(loggedInUser)
    const scriptureVersionHistory = getUserSettings(loggedInUser, `scriptureVersionHistory`)

    const extraData = JSON.stringify({
      lastError,
      loggedInUser,
      build,
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
      scriptureCardSettings,
      scriptureVersionHistory,
      helpsCardSettings,
    })

    let res

    try {
      const fetchPromise = fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          category: state.category,
          message: state.message,
          extraData,
        }),
      })
      const timeout = new Promise((_r, rej) => {
        const TIMEOUT_ERROR = `Network Timeout Error ${HTTP_GET_MAX_WAIT_TIME}ms`
        return setTimeout(() => rej(TIMEOUT_ERROR), HTTP_GET_MAX_WAIT_TIME)
      })
      res = await Promise.race([fetchPromise, timeout])
    } catch (e) {
      console.warn(`onSubmitFeedback() - failure calling '/api/feedback'`, e)
      processError(e)
      actions.setSubmitting(false)
      actions.setShowSuccess(false)
      actions.setShowError(true)
      return
    }

    const response = await res.json()

    if (res.status === 200) {
      actions.setShowSuccess(true)
    } else {
      const error = response.error
      console.warn(`onSubmitFeedback() - error response = ${JSON.stringify(error)}`)
      const httpCode = parseInt(error.code, 10)
      const errorMessage = error.message + '.'
      actions.setShowError(true)
      processError(errorMessage, httpCode)
    }

    actions.setSubmitting(false)
  }

  const submitDisabled = state.submitting || !state.name || !state.email || !state.message || !state.category

  return (
    <>
      <div className='flex flex-col h-auto p-0 m-0' style={{ width: '480px' }}>
        <div className='flex flex-row'>
          <h3 className='flex-auto text-xl text-gray-600 font-semibold mx-8 mb-0'>
            Submit a Bug Report or Feedback
          </h3>
        </div>
        <div>
          <TextField
            id='name-feedback-form'
            type='given-name'
            label='Name'
            autoComplete='name'
            defaultValue={state.name}
            variant='outlined'
            onChange={onNameChange}
            classes={{ root: classes.textField }}
          />
          <TextField
            id='Email-feedback-form'
            type='email'
            label='Email'
            autoComplete='email'
            defaultValue={state.email}
            variant='outlined'
            onChange={onEmailChange}
            classes={{ root: classes.textField }}
            error={actions.showEmailError}
            helperText={state.showEmailError ?state. emailError : null}
            FormHelperTextProps={{ classes: helperTestClasses }}
            inputRef={emailEditRef}
          />
          <FormControl variant='outlined' className={classes.formControl}>
            <InputLabel id='categories-dropdown-label'>
              Category:
            </InputLabel>
            <Select
              id='categories-dropdown'
              value={state.category}
              onChange={onCategoryChange}
              label='Category'
            >
              {categories.map((label, i) => (
                <MenuItem key={`${label}-${i}`} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id='message-feedback-form'
            type='text'
            label='Message'
            multiline
            rows={4}
            defaultValue={state.message}
            variant='outlined'
            onChange={onMessageChange}
            classes={{ root: classes.textField }}
          />
          <div className='flex flex-col mx-8 mb-4'>
            <Button
              className='self-end'
              variant='contained'
              color='primary'
              size='large'
              disableElevation
              disabled={submitDisabled}
              onClick={onSubmitFeedback}
            >
              {state.submitting ? 'Submitting' : 'Submit'}
            </Button>
            {state.showSuccess || state.showError ? (
              <Alert
                severity={state.showSuccess ? 'success' : 'error'}
                message={
                  state.showSuccess
                    ? `Your ${
                      state.category || 'feedback'
                    } was submitted successfully!`
                    : `Something went wrong submitting your ${
                      state.category || 'feedback'
                    }.`
                }
                onClick={state.showSuccess ? onClose : null}
              />
            ) : null}
          </div>
        </div>
      </div>
      { !!state.networkError &&
        <NetworkErrorPopup
          networkError={state.networkError}
          setNetworkError={actions.setNetworkError}
          closeButtonStr={CLOSE}
        />
      }
    </>
  )
}

FeedbackCard.propTypes = {
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
  // to open or close the feedback card
  open: PropTypes.bool,
  // flag that feedback card needs to initialize
  initCard: PropTypes.bool,
  // callback for when card has initialized
  setInitCard: PropTypes.func,
  // callback to close feedback popup
  onClose: PropTypes.func,
}

export default FeedbackCard
