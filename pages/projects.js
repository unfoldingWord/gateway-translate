import { useRouter } from 'next/router'

import SetUpWrapper from '@components/SetUpWrapper'
import ProjectList from '@components/ProjectList'

const Projects = () => {
  const router = useRouter()
  return (
    <SetUpWrapper>
      <ProjectList onSelect={() => router.push('/')} />
    </SetUpWrapper>
  )
}

export default Projects
