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
  const [addDisabled, setAddDisabled] = useState(true)
  const [repos, setRepos] = useState([])
  const [selectedRepository, setSelectedRepository] = useState('')
  const [repository, setRepository] = useState(null)
  const [catalogProd, setCatalogProd] = useState(null)
  const [catalogLatest, setCatalogLatest] = useState(null)
  const [refTypeChoice, setRefTypeChoice] = useState('')
  const [availableRefs, setAvailableRefs] = useState(null)
  const [selectedRef, setSelectedRef] = useState(null)
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
  const [focus, setFocus] = useState('')

  const handleSourceChange = event => {
    setUsfmSource(event.target.value)
  }

  const handleRefTypeChange = event => {
    console.log(event.target.value)
    setSelectedRef('')
    setRefTypeChoice(event.target.value)
  }

  useEffect( () => {
    console.log("usfmSource=", usfmSource)
    if ( usfmSource === 'dcs' ) {
      if ( selectedOrganization === '' ) {
        setAddDisabled(true)
        return
      }
  
      if ( selectedBook === null ) {
        setAddDisabled(true)
        return
      }
  
      if ( selectedRepository === '' ) {
        setAddDisabled(true)
        return
      }

      if ( selectedRef === null ) {
        setAddDisabled(true)
        return
      }

      // all inputs are present, make the button active
      setAddDisabled(false)
    } else if ( usfmSource === 'url' ) {
      console.log('Url=',url)
      if ( url === '' ) {
        setAddDisabled(true)
      } else {
        setAddDisabled(false)
      }
    } else if ( usfmSource === 'upload' ) {
      console.log('uploadedfilename=',uploadedFilename)
      if ( uploadedFilename === null || uploadedFilename === '' ) {
        setAddDisabled(true)
      } else {
        setAddDisabled(false)
      }
    }
  }, [usfmSource, selectedOrganization, selectedBook, selectedRepository, url, uploadedFilename])

  useEffect( () => {
    setSelectedOrganization(organization)
  }, [organization])

  const handleUrlChange = event => {
    setUrl(event.target.value)
    console.log('handleUrlChange():',event.target.value)
    setFocus('url')
  }

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleOrgChange = event => {
    setRepos([])
    setSelectedOrganization(event.target.value)
  }

  const handleClickNext = () => {
    onNext({pushAccess, usfmData, uploadedFilename, usfmSource, selectedBook, url, languageId, repository: selectedRepository, owner: selectedOrganization, ref: selectedRef})
    handleClickClose()
    setUrl('')
  }

  useEffect(() => {
    async function getRepos() {
      setLoading(true)
      const response = await repoClient.repoSearch({owner: selectedOrganization, subject:bibleSubjects.join(',')})
      if ( 200 === response.status ) {
        setRepos( response.data.data )
      }
      setLoading(false)
    }
    if ( repoClient && selectedOrganization) {
      getRepos().catch(console.error)
    } else {
      setRepos([])
    }
  }, [repoClient, selectedOrganization])

  const handleRepositoryChange = event => {
    setSelectedRepository(event.target.value)
  }

  useEffect(() => {
    if (selectedOrganization && selectedRepository) {
      console.log("repos size: ", repos.length, selectedOrganization, selectedRepository)
      console.log(repos)
      const repo = repos.find((repo) => repo.name === selectedRepository && repo.owner.username == selectedOrganization)
      console.log("REPO", repo)
      setAvailableRefs(null)
      if (repo) {
        setRepository(repo)
        setLanguageId(repo.language)
        setAvailableBooks(repo.ingredients.map(ingredient => ingredient.identifier))
        if (repo.catalog ) {
          setCatalogProd(repo.catalog.prod)
          setCatalogLatest(repo.catalog.latest)
        } else {
          setCatalogProd(null)
          setCatalogLatest(null)
        }
        setPushAccess(repo?.permissions?.push)
      } else {
        setRepository(null)
        setLanguageId(null)
        setAvailableBooks(null)
        setCatalogProd(null)
        setCatalogLatest(null)
        setPushAccess(false)
      }
    }
  }, [selectedRepository, selectedOrganization])

  useEffect(() => {
    const fetchBranches = async () => {
      const branches = await repoClient.repoListBranches({owner: selectedOrganization, repo: selectedRepository}).then(({data}) => data).catch(console.error)
      console.log("BRANCHES", branches)
      if (branches.length)
        setAvailableRefs(branches.map(branch => {return {id: branch.name, name: branch.name}}))
      else
        setAvailableRefs(null)
    }

    const fetchTags = async () => {
      const tags = await repoClient.repoListTags({owner: selectedOrganization, repo: selectedRepository}).then(({data}) => data).catch(console.error)
      console.log("TAGS", tags)
      if (tags.length)
        setAvailableRefs(tags.map(tag => {return {id: tag.name, name: tag.name}}))
      else
        setAvailableRefs(null)
    }

    if (selectedOrganization && selectedRepository) {
      console.log(selectedOrganization, selectedRepository, refTypeChoice)
      switch (refTypeChoice) {
        case "branch":
          fetchBranches()
          break
        case "tag":
          fetchTags()
          break
        default:
          setAvailableRefs(null)
      }
    }
  }, [selectedRepository, selectedOrganization, refTypeChoice, repoClient])

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
      formComponents = <TextField label="Url" type="url" value={url} onChange={handleUrlChange} fullWidth={true} inputRef={input => input && focus === 'url' && input.focus()} />
      break;
    case 'upload':
      formComponents = <Button
        fullWidth
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
      >
        Upload USFM file {uploadedFilename && '>>"'+uploadedFilename+'"'}
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
          control={<Checkbox checked={showAll} onChange={(event) => {
            setShowAll(event.target.checked);
            setSelectedBook(null);
            setSelectedOrganization('');
            setSelectedRepository('')
          }} />}
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
        {repository ?
        <FormControl>
          <FormLabel id="ref">Release or Branch</FormLabel>
          <RadioGroup
            aria-labelledby="ref-radio-buttons-group-label"
            defaultValue="prod"
            name="ref-radio-buttons-group"
            row
            value={refTypeChoice}
            onChange={handleRefTypeChange}
          >
            <div>
              {catalogProd?<FormControlLabel value="prod" control={<Radio />} label={"Latest Release ("+catalogProd.branch_or_tag_name+")"} />:""}
            <FormControlLabel value="tag" control={<Radio />} label="Tag" />
            </div>
            <div>
              {catalogLatest?<FormControlLabel value="latest" control={<Radio />} label={"Default Branch ("+catalogLatest.branch_or_tag_name+")"} />:""}
            <FormControlLabel value="branch" control={<Radio />} label="Branch" />
            </div>
          </RadioGroup>
        </FormControl>: ""}
        {console.log("AR:", availableRefs)}
        {availableRefs ? <Autocomplete
          id="select-ref"
          value={selectedRef}
          options={ availableRefs }
          getOptionLabel={option => {console.log(option); return option.name}}
          isOptionEqualToValue={(option, value) => {console.log("op", option.id, "val", value, option.id===value); return option.id === value}}
          onChange={(event, ref) => {
            console.log("SELECTED REF", ref)
            setSelectedRef(ref)
          }}
          renderInput={(params) => <TextField {...params} label={refTypeChoice} margin="normal" />}
        />: ""}
        {availableBooks ?
        <Autocomplete
          id="select-book"
          value={selectedBook}
          options={ bookSelectList(availableBooks) }
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, book) => {
            setSelectedBook(book)
          }}
          renderInput={(params) => <TextField {...params} label="Book" margin="normal" />}
        /> : ""}
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
          disabled={addDisabled}
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
