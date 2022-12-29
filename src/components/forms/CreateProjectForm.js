import { useContext, useState, useEffect } from 'react'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import {
  Button,
  TextField,
  InputAdornment,
  Stack,
  Autocomplete,
} from '@mui/material'

import SettingsForm from '@components/forms/SettingsForm'
import { languages as LANGUAGES } from '@common/languages'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import { ProjectsContext } from 'zip-project'
import SelectBookPopup from '@components/SelectBookPopup/SelectBookPopup'

const CreateProjectForm = ({ onCreate = () => null }) => {
  const [projectName, setProjectName] = useState('')
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [inputLanguage, setInputLanguage] = useState('')
  const [createDisabled, setCreateDisabled] = useState(true)
  const [showAddBooks, setShowAddBooks] = useState(false)

  const {
    actions: { setLanguageId },
  } = useContext(StoreContext)

  const {
    state: { books },
  } = useContext(AppContext)

  const { addProject } = useContext(ProjectsContext)

  useEffect(() => {
    setCreateDisabled(!books.length || !projectName.length)
  }, [books])

  // <MenuItem key={`${languageId}-${i}`} value={languageId}>
  //       {`${languageId} - ${languageName} - ${localized}`}
  //     </MenuItem>

  const handleCreateProject = () => {
    console.log(
      `${projectName} project created with ${books.length} books and primary translating language ${language.languageName}`
    )
    addProject(projectName, books)
    onCreate()
  }

  const handlePrimaryLanguageChange = (event, newLanguage) => {
    setLanguageId(newLanguage?.id)
    setLanguage(newLanguage)
  }

  const handleProjectNameChange = e => {
    setProjectName(e.target.value)
    setCreateDisabled(!books.length || !e.target.value.length)
  }

  const getLanguagesLabel = ({ languageId, languageName, localized }, i) =>
    `${languageId} - ${languageName} - ${localized}`

  const renderAutoInput = params => (
    <TextField
      {...params}
      required
      label='Primary Translating Language'
      value={inputLanguage}
      onChange={(event, newInputLanguage) => setInputLanguage(newInputLanguage)}
    />
  )

  return (
    <>
      <SettingsForm icon={LibraryAddIcon} label={'Create Project'}>
        <TextField
          sx={{ my: 1 }}
          required
          id='projectName'
          label={'Project Name'}
          value={projectName}
          fullWidth={true}
          onChange={handleProjectNameChange}
        />

        <Autocomplete
          id='primary-language-select-outlined'
          required
          options={LANGUAGES}
          getOptionLabel={getLanguagesLabel}
          value={language}
          onChange={handlePrimaryLanguageChange}
          sx={{ my: 1 }}
          renderInput={renderAutoInput}
        />

        <Stack spacing={2} direction='row' sx={{ mt: '1rem' }}>
          <Button
            color='primary'
            variant='contained'
            onClick={() => setShowAddBooks(true)}
            sx={{ flex: 1 }}
          >
            Add Books
          </Button>
          <Button
            disabled={createDisabled}
            color='primary'
            variant='contained'
            onClick={handleCreateProject}
            sx={{ flex: 1 }}
          >
            Create
          </Button>
        </Stack>
        <SelectBookPopup
          showModal={showAddBooks}
          setShowModal={setShowAddBooks}
        />
      </SettingsForm>
    </>
  )
}

export default CreateProjectForm
