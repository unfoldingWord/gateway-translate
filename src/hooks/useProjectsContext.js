import { useContext } from 'react'
import ProjectsContext from '@context/ProjectsContext'

const useProjectsContext = () => {
  return useContext(ProjectsContext)
}

export default useProjectsContext
