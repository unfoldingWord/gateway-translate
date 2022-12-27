import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import LoadingButton from '@mui/lab/LoadingButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'

import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import ZipUsfmInput from './ZipUsfmInput'

const bibleSubjects = [
  'Aligned Bible',
  'Bible',
  'Hebrew Old Testament',
  'Greek New Testament',
]

export default function SelectBookPopup({ onNext, showModal, setShowModal }) {
  const {
    state: { owner: organization },
  } = useContext(StoreContext)

  const {
    state: { repoClient, organizationClient },
  } = useContext(AppContext)
  const [repos, setRepos] = useState([])
  const [selectedRepository, setSelectedRepository] = useState('')
  // const [availableBooks, setAvailableBooks] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [usfmSource, setUsfmSource] = useState('upload')
  const [url, setUrl] = useState('')
  // const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState(
    organization || ''
  )
  const [uploadedFilename, setUploadedFilename] = useState(null)
  const [usfmData, setUsfmData] = useState(null)
  const [languageId, setLanguageId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pushAccess, setPushAccess] = useState(false)

  const handleSourceChange = event => {
    setUsfmSource(event.target.value)
  }

  useEffect(() => {
    setSelectedOrganization(organization)
  }, [organization])

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleClickNext = () => {
    if (usfmSource === 'upload_zip') {
      onZipSubmit()
      return
    }
    onNext({
      pushAccess,
      usfmData,
      uploadedFilename,
      usfmSource,
      selectedBook,
      url,
      languageId,
      repository: selectedRepository,
      owner: selectedOrganization,
    })
    handleClickClose()
    setUrl('')
  }

  useEffect(() => {
    async function getLanguages() {
      setLoading(true)
      const response = await repoClient.repoSearch({
        owner: selectedOrganization,
        subject: bibleSubjects.join(','),
      })
      if (200 === response.status) {
        setRepos(response.data.data)
      }
      setLoading(false)
    }
    if (repoClient) {
      getLanguages().catch(console.error)
    }
  }, [repoClient, selectedOrganization])

  const handleFileUpload = e => {
    if (!e.target.files) {
      return
    }
    setLoading(true)

    const file = e.target.files[0]
    const { name } = file
    setUploadedFilename(name)

    const reader = new FileReader()
    reader.onload = evt => {
      if (!evt?.target?.result) {
        return
      }
      const { result } = evt.target
      setUsfmData(result)
      setLoading(false)
    }
    reader.readAsText(file)
  }

  const handleZipLoad = (usfmData, file) => {
    console.log(usfmData)
    // TODO: do stuff with this data
    // We will probably have to call onNext here... but also change the functionality of onNext

    setLoading(false)
    handleClickClose()
    setUrl('')
  }

  let formComponents
  switch (usfmSource) {
    case 'url':
      formComponents = (
        <>
          <TextField
            label='Url'
            type='url'
            value={url}
            onChange={handleUrlChange}
            fullWidth={true}
          />
          <LoadingButton
            loading={loading}
            size='large'
            color='primary'
            className='my-3'
            variant='contained'
            onClick={handleClickNext}
            loadingPosition='start'
            startIcon={<NoteAddIcon />}
          >
            Add
          </LoadingButton>
        </>
      )
      break
    case 'upload':
    default:
      formComponents = (
        <>
          <Button
            fullWidth
            component='label'
            variant='outlined'
            startIcon={<UploadFileIcon />}
          >
            Upload USFM file
            <input
              type='file'
              accept='.usfm'
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          <LoadingButton
            loading={loading}
            size='large'
            color='primary'
            className='my-3'
            variant='contained'
            onClick={handleClickNext}
            loadingPosition='start'
            startIcon={<NoteAddIcon />}
          >
            Add
          </LoadingButton>
        </>
      )
      break
    case 'upload_zip':
      formComponents = <ZipUsfmInput handleZipLoad={handleZipLoad} />
      break
  }

  return (
    <>
      <DraggableModal open={showModal} handleClose={handleClickClose}>
        <Card
          closeable
          title={`Select a Book`}
          onClose={handleClickClose}
          classes={{
            dragIndicator: 'draggable-dialog-title',
            root: 'w-104',
          }}
        >
          <FormControl>
            <FormLabel id='source'>Source</FormLabel>
            <RadioGroup
              aria-labelledby='source-radio-buttons-group-label'
              defaultValue='upload'
              name='source-radio-buttons-group'
              row
              value={usfmSource}
              onChange={handleSourceChange}
            >
              <FormControlLabel
                value='url'
                control={<Radio />}
                label='Custom URL'
              />
              <FormControlLabel
                value='upload'
                control={<Radio />}
                label='Upload USFM file'
              />
              <FormControlLabel
                value='upload_zip'
                control={<Radio />}
                label='Upload Zip'
              />
            </RadioGroup>
          </FormControl>
          {formComponents}
        </Card>
      </DraggableModal>
    </>
  )
}

SelectBookPopup.propTypes = {
  /** On next button click event handler */
  onNext: PropTypes.func,
}

// DCS CODE GRAVEYARD
//
// import Autocomplete from '@mui/material/Autocomplete'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
// import InputLabel from '@mui/material/InputLabel'
// import Checkbox from '@mui/material/Checkbox'
// import FormGroup from '@mui/material/FormGroup'
//
// import { bookSelectList } from '@common/BooksOfTheBible'
//
// const handleOrgChange = event => {
//   setSelectedOrganization(event.target.value)
// }
//
// const handleRepositoryChange = event => {
//   setSelectedRepository(event.target.value)
//   const repository = repos.find(repo => repo.name === event.target.value)
//   setLanguageId(repository.language)
//   setAvailableBooks(repository.books)
//   setPushAccess(repository?.permissions?.push)
// }
