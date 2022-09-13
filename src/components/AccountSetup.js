import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import SaveIcon from '@material-ui/icons/Save'
import { StoreContext } from '@context/StoreContext'
import TranslationSettings from '@components/TranslationSettings'

function AccountSetup({ authentication }) {
  const {
    state: { owner: organization, languageId },
    actions: { setShowAccountSetup },
  } = useContext(StoreContext)

  const handleSubmit = () => {
    setShowAccountSetup(false)
  }

  const disabledButton = !organization || !languageId

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
        <Paper className='flex flex-col h-40 w-full p-6 pt-3 px-7 my-2'>
          <h3>Account Setup</h3>
          <p className='text-lg'>
            Choose your Organization and Primary Language
          </p>
        </Paper>
        <TranslationSettings authentication={authentication} />
        <div className='flex justify-end h-62 w-full'>
          <Button
            size='large'
            color='primary'
            className='my-2'
            disableElevation
            variant='contained'
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            disabled={disabledButton}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

AccountSetup.propTypes = { authentication: PropTypes.object.isRequired }

export default AccountSetup
