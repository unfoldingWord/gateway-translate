import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LoadingButton from '@mui/lab/LoadingButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'

import { bookSelectList } from '@common/BooksOfTheBible'
import { StoreContext } from '@context/StoreContext'
import { AuthContext } from '@context/AuthContext'
import { AppContext } from '@context/AppContext'

const bibleSubjects = [
  'Aligned Bible',
  'Bible',
  'Hebrew Old Testament',
  'Greek New Testament'
]

export default function SelectBookPopup(
{
  onNext,
  showModal,
  setShowModal,
}) {
  const {
    state: {
      owner: organization,
    },
  } = useContext(StoreContext)
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      repoClient,
      organizationClient,
    }
  } = useContext(AppContext)
  const [repos, setRepos] = useState([])
  const [selectedRepository, setSelectedRepository] = useState('')
  const [availableBooks, setAvailableBooks] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [usfmSource, setUsfmSource] = useState('dcs')
  const [url, setUrl] = useState('')
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState(organization || '')
  const [showAll, setShowAll] = useState(false)
  const [uploadedFilename, setUploadedFilename] = useState(null)
  const [usfmData, setUsfmData] = useState(null)
  const [languageId, setLanguageId] = useState(null)
  const [loading, setLoading] = useState(false);
  const [pushAccess, setPushAccess] = useState(false);

  const handleSourceChange = event => {
    setUsfmSource(event.target.value)
  }

  useEffect( () => {
    setSelectedOrganization(organization)
  }, [organization])

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleOrgChange = event => {
    setSelectedOrganization(event.target.value)
  }

  const handleClickNext = () => {
    onNext({pushAccess, usfmData, uploadedFilename, usfmSource, selectedBook, url, languageId, repository: selectedRepository, owner: selectedOrganization})
    handleClickClose()
  }

  useEffect(() => {
    async function getLanguages() {
      setLoading(true)
      const response = await repoClient.repoSearch({owner: selectedOrganization, subject:bibleSubjects.join(',')})
      if ( 200 === response.status ) {
        setRepos( response.data.data )
      }
      setLoading(false)
    }
    if ( repoClient ) {
      getLanguages().catch(console.error)
    }
  }, [repoClient, selectedOrganization])

  const handleRepositoryChange = event => {
    setSelectedRepository(event.target.value)
    const repository = repos.find((repo) => repo.name === event.target.value)
    setLanguageId(repository.language)
    setAvailableBooks(repository.books)
    setPushAccess(repository?.permissions?.push)
  }

  useEffect(() => {
    async function getOrgs() {
      let response
      setLoading(true)

      if ( ! showAll && authentication ) {
        response = await organizationClient.orgListUserOrgs({username: authentication.user.login})
      } else {
        response = await organizationClient.orgGetAll()
      }

      if (response.status === 200) {
        setOrganizations( response.data.filter((org) => org.repo_subjects && org.repo_subjects.some((subject) => bibleSubjects.includes(subject)))
          .map(org => org.username)
        )
      }
      setLoading(false)
    }
    if ( organizationClient ) {
      getOrgs().catch(console.error)
    }

  }, [authentication, showAll, organizationClient])


  const handleFileUpload = (e ) => {
    if (!e.target.files) {
      return;
    }
    setLoading(true)

    const file = e.target.files[0];
    const { name } = file;
    setUploadedFilename(name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;
      setUsfmData(result)
      setLoading(false)
    };
    reader.readAsText(file);
  };

  let formComponents
  switch (usfmSource) {
    case 'url':
      formComponents = <TextField label="Url" type="url" value={url} onChange={handleUrlChange} fullWidth={true} />
      break;
    case 'upload':
      formComponents = <Button
        fullWidth
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
      >
        Upload USFM file
        <input type="file" accept=".usfm" hidden onChange={handleFileUpload} />
      </Button>
      break;
    case 'dcs':
    default:
      formComponents = <>
        <FormControl fullWidth margin="normal">
          <InputLabel id='organization-select-outlined-label'>
            Organization
          </InputLabel>
          <Select
            labelId='organization-select-outlined-label'
            id='organization-select-outlined'
            value={selectedOrganization}
            onChange={handleOrgChange}
            label='Organization'
          >
            {organizations.map((org, i) => (
              <MenuItem key={`${org}-${i}`} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={showAll} onChange={(event) => {setShowAll(event.target.checked)}} />}
          label="Show all organizations"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id='language-label'>
            Repository
          </InputLabel>
          <Select
            labelId='primary-language-select-outlined-label'
            id='primary-language-select-outlined'
            value={selectedRepository}
            onChange={handleRepositoryChange}
            label='Repository'
          >
            {repos.map(({
              name, title, language_title,
            }, i) => (
              <MenuItem key={`${name}-${i}`} value={name}>
                {`${name} - ${title} - ${language_title}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          id="select-book"
          value={selectedBook}
          options={ bookSelectList(availableBooks) }
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, book) => {
            setSelectedBook(book);
          }}
          renderInput={(params) => <TextField {...params} label="Select" margin="normal" />}
        />
      </>
      break;
  }

  return (
    <DraggableModal
      open={showModal}
      handleClose={handleClickClose}
    >
      <Card
        closeable
        title={`Select a Book`}
        onClose={handleClickClose}
        classes={{
          dragIndicator: 'draggable-dialog-title',
          root: 'w-104'
        }}
      >
        <FormControl>
          <FormLabel id="source">Source</FormLabel>
          <RadioGroup
            aria-labelledby="source-radio-buttons-group-label"
            defaultValue="dcs"
            name="source-radio-buttons-group"
            row
            value={usfmSource}
            onChange={handleSourceChange}
          >
            <FormControlLabel value="dcs" control={<Radio />} label="DCS Repo" />
            <FormControlLabel value="url" control={<Radio />} label="Custom URL" />
            <FormControlLabel value="upload" control={<Radio />} label="Upload USFM file" />
          </RadioGroup>
        </FormControl>
        {formComponents}
        <LoadingButton
          loading={loading}
          size='large'
          color='primary'
          className='my-3'
          variant='contained'
          onClick={handleClickNext}
          loadingPosition="start"
          startIcon={<NoteAddIcon />}
        >
          Add
        </LoadingButton>
      </Card>
    </DraggableModal>
  )
}

SelectBookPopup.propTypes = {
  /** On next button click event handler */
  onNext: PropTypes.func,
}
