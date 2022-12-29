import { useRouter } from 'next/router'

import SetUpWrapper from '@components/SetUpWrapper'
import CreateProjectForm from '@components/forms/CreateProjectForm'

const CreateProject = () => {
  const router = useRouter()
  return (
    <SetUpWrapper>
      <CreateProjectForm onCreate={() => router.push('/')} />
    </SetUpWrapper>
  )
}

export default CreateProject
