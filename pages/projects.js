import { useRouter } from 'next/router'

import SetUpWrapper from '@components/SetUpWrapper'
import ProjectList from '@components/ProjectList'

const Projects = () => {
  const router = useRouter()
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
        <ProjectList onSelect={() => router.push('/')} />
      </div>
    </div>
  )
}

export default Projects
