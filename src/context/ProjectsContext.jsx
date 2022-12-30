import React, { createContext, useState, useCallback } from 'react'

import { useTransformUsfmZip } from 'zip-project'
import { useLocalForage } from 'zip-project'

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const { getAllFromStore, setInStore, deleteFromStore } =
    useLocalForage('projects')

  const { arrayBufferToUsfmData, usfmDataToFileData } = useTransformUsfmZip()

  const projectExists = projectName => {
    return projects.some(project => project.name === projectName)
  }

  const fetchProjects = useCallback(async () => {
    const storeData = await getAllFromStore()
    const projectPromises = storeData.map(async data => {
      return {
        id: data.id,
        name: data.key,
        data: await arrayBufferToUsfmData(data.value),
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

  const addProject = async (projectName, usfmData) => {
    if (projectExists(projectName)) {
      // complain to the user
      return false
    }

    const newProject = {
      id: projects.length,
      name: projectName,
      data: usfmData,
    }

    const { arrayBuffer: usfmArrayBuffer } = await usfmDataToFileData(usfmData)

    await setInStore(projectName, usfmArrayBuffer)
    setProjects([...projects, newProject])
    return true
  }

  const updateProject = async (projectName, usfmData) => {
    if (!projectExists(projectName)) {
      // complain to the user
      return false
    }

    const updatedProjects = projects.map(project => {
      if (project.name === projectName) {
        return { ...project, data: usfmData }
      }
      return project
    })
    const { arrayBuffer: usfmArrayBuffer } = await usfmDataToFileData(usfmData)

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
    console.log(project)
    setSelectedProject({ ...project })
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
  }

  return (
    <ProjectsContext.Provider value={context}>
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
