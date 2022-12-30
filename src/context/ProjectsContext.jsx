import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react'
import { useTransformUsfmZip } from 'zip-project'
import { useLocalForage } from 'zip-project'

import { AppContext } from '@context/AppContext'

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  const { getAllFromStore, setInStore, deleteFromStore } =
    useLocalForage('projects')

  const { storeBufferToUsfmData, usfmDataToStoreBuffer } = useTransformUsfmZip()

  const {
    state: { books },
    actions: { setBooks },
  } = useContext(AppContext)

  // Whenever a project is loaded and changes are made, save those changes
  useEffect(() => {
    if (!!selectedProject) {
      updateProject(selectedProject.name, books)
    }
  }, [books])

  const projectExists = projectName => {
    return projects.some(project => project.name === projectName)
  }

  const fetchProjects = useCallback(async () => {
    const storeData = await getAllFromStore()
    const projectPromises = storeData.map(async data => {
      return {
        id: data.id,
        name: data.key,
        books: await storeBufferToUsfmData(data.value),
        // TODO: (maybe) detect language in data and store
        // language: detectLanguage(data.value)
      }
    })
    const _projects = await Promise.all(projectPromises)
    setProjects(_projects)
  }, [getAllFromStore])

  const getProject = projectName => {
    const foundProject = projects.find(project => project.name === projectName)
    return { ...foundProject }
  }

  const addProject = async (projectName, books) => {
    if (projectExists(projectName)) {
      // complain to the user
      return false
    }

    const newProject = {
      id: projects.length,
      name: projectName,
      books,
    }

    const usfmArrayBuffer = await usfmDataToStoreBuffer(books)
    await setInStore(projectName, usfmArrayBuffer)

    setSelectedProject({ ...newProject })
    setProjects([...projects, { ...newProject }])
    setBooks([...newProject.books])
    return true
  }

  const updateProject = async (projectName, books) => {
    if (!projectExists(projectName)) {
      // complain to the user
      return false
    }

    const updatedProjects = projects.map(project => {
      if (project.name === projectName) {
        return { ...project, books }
      }
      return project
    })
    const usfmArrayBuffer = await usfmDataToStoreBuffer(books)

    await setInStore(projectName, usfmArrayBuffer)
    setProjects(updatedProjects)
    return true
  }

  const deleteProject = async projectName => {
    if (!projectExists(projectName)) {
      // complain to the user
      return false
    }

    await deleteFromStore(projectName)
    setProjects(projects.filter(project => project.name !== projectName))
    return true
  }

  const selectProject = project => {
    setBooks([...project.books])
    setSelectedProject({ ...project })
  }

  const clearSelectedProject = () => {
    setSelectedProject(null)
    setBooks([])
  }

  const context = {
    projects,
    selectedProject,
    fetchProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    clearSelectedProject,
  }

  return (
    <ProjectsContext.Provider value={context}>
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
