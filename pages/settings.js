import { useContext } from 'react'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import { AuthenticationContext } from 'gitea-react-toolkit'
// import { AuthContext } from '@context/AuthContext'
// import Layout from '@components/Layout'
import TranslationSettings from '@components/TranslationSettings'

const SettingsPage = () => {
  const router = useRouter()
  const { state: authentication } = useContext(AuthenticationContext)
  // const { state: authentication } = useContext(AuthContext)
  console.log("SettingsPage() authentication=", authentication)
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
        <h1 className='mx-4'>Account Settings</h1>
        <TranslationSettings authentication={authentication} />
        <div className='flex justify-end'>
          <Button
            size='large'
            color='primary'
            className='my-3'
            variant='contained'
            onClick={() => router.push('/')}
            startIcon={<SaveIcon />}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
