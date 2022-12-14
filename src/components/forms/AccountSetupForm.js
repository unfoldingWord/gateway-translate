import { useContext } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import SaveIcon from '@mui/icons-material/Save'
import { StoreContext } from '@context/StoreContext'
import TranslationSettings from '@components/TranslationSettings'

function AccountSetup({ authentication, onSubmit = () => null }) {
  const {
    state: { owner: organization, languageId },
    actions: { setShowAccountSetup },
  } = useContext(StoreContext)

  const handleSubmit = () => {
    setShowAccountSetup(false)
    onSubmit()
  }

  const disabledButton = !organization || !languageId

  return (
    <>
      <Paper className='flex flex-col h-40 w-full p-6 pt-3 px-7 my-2'>
        <h3>Account Setup</h3>
        <p className='text-lg'>Choose your Organization and Primary Language</p>
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
    </>
  )
}

AccountSetup.propTypes = { authentication: PropTypes.object.isRequired }

export default AccountSetup
