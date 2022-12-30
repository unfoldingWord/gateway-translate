import { useRouter } from 'next/router'

import SetUpWrapper from '@components/SetUpWrapper'
import ProjectList from '@components/ProjectList'

const CreateProject = () => {
  const router = useRouter()
  return (
    <SetUpWrapper>
      <ProjectList onSelect={() => router.push('/')} />
    </SetUpWrapper>
  )
}

export default CreateProject
