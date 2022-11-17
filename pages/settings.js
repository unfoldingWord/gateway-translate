import { useRouter } from 'next/router'

import useAuthContext from '@hooks/useAuthContext'
import SetUpWrapper from '@components/SetUpWrapper'
import AccountSetupForm from '@components/forms/AccountSetupForm'

const SettingsPage = () => {
  const {
    state: { authentication },
  } = useAuthContext()
  const router = useRouter()
  return (
    <SetUpWrapper>
      <AccountSetupForm
        authentication={authentication}
        onSubmit={() => router.push('/')}
      />
    </SetUpWrapper>
  )
}

export default SettingsPage
