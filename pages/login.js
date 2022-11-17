import LoginForm from '@components/forms/LoginForm'
import SetUpWrapper from '@components/SetUpWrapper'
import { useRouter } from 'next/router'

function LoginPage() {
  const router = useRouter()
  return (
    <SetUpWrapper>
      <LoginForm onLogin={() => router.push('/')} />
    </SetUpWrapper>
  )
}

export default LoginPage
