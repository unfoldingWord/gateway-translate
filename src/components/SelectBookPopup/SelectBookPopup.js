import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Snackbar from '@mui/material/Snackbar'

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'

import { AppContext } from '@context/AppContext'
import UrlInput, { createUrlEntry } from './UrlInput'
import UsfmInput, { createUsfmEntry } from './UsfmInput'
import ZipUsfmInput, { createZipUsfmEntry } from './ZipUsfmInput'

export default function SelectBookPopup({ showModal, setShowModal }) {
  const [usfmSource, setUsfmSource] = useState('upload')
  const [alreadyOpenNotice, setAlreadyOpenNotice] = useState(false)

  const {
    state: { books },
    actions: { setBooks },
  } = useContext(AppContext)

  const handleSourceChange = event => {
    setUsfmSource(event.target.value)
  }

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleAlreadyOpenNoticeClose = () => {
    setAlreadyOpenNotice(false)
  }

  const addBook = entry => {
    if (books.some(book => book.id === entry.id)) {
      console.log('book already loaded:', entry.id)
      setAlreadyOpenNotice(true)
    } else {
      console.log('adding book:', entry.id)
      setBooks([...books, entry])
    }
    console.log('onNext() _books:', [...books, entry])
  }

  const handleUrlSubmit = url => {
    if (!books || !setBooks || !url) {
      return
    }
    let entry = { id: null, bookId: '', source: 'url', content: null }
    addBook(createUrlEntry(entry, url))
    handleClickClose()
  }

  const handleUsfmSubmit = (uploadedFilename, usfmData) => {
    if (!books || !setBooks || !usfmData) {
      return
    }
    let _entry = { id: null, bookId: '', source: usfmSource, content: null }
    addBook(createUsfmEntry(_entry, uploadedFilename, usfmData))
    handleClickClose()
  }

  const handleZipSubmit = (zipUsfmData, file) => {
    if (!books || !setBooks || !zipUsfmData) {
      return
    }
    console.log(zipUsfmData)

    let _books = [...books]
    let bookAlreadyOpen = false
    zipUsfmData.forEach(usfmDataObject => {
      const entry = createZipUsfmEntry(usfmDataObject)
      if (books.some(book => book.id === entry.id)) {
        console.log('book already loaded:', entry.id)
        bookAlreadyOpen = true
      } else {
        _books = [..._books, createZipUsfmEntry(usfmDataObject)]
      }
    })

    if (bookAlreadyOpen) setAlreadyOpenNotice(true)
    setBooks([..._books])
    handleClickClose()
  }

  let formComponents
  switch (usfmSource) {
    case 'url':
      formComponents = <UrlInput handleUrlSubmit={handleUrlSubmit} />
      break
    case 'upload':
    default:
      formComponents = <UsfmInput handleUsfmSubmit={handleUsfmSubmit} />
      break
    case 'upload_zip':
      formComponents = <ZipUsfmInput handleZipLoad={handleZipSubmit} />
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
      <Snackbar
        open={alreadyOpenNotice}
        autoHideDuration={6000}
        onClose={handleAlreadyOpenNoticeClose}
        message='Book is already open'
        // action={action}
      />
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
// const {
//   state: { owner: organization },
// } = useContext(StoreContext)
// const {
//   state: { repoClient, organizationClient },
// } = useContext(AppContext)
//
// const [repos, setRepos] = useState([])
// const [selectedRepository, setSelectedRepository] = useState('')
// const [availableBooks, setAvailableBooks] = useState(null)
// const [organizations, setOrganizations] = useState([])
// const [selectedOrganization, setSelectedOrganization] = useState(
//   organization || ''
// )
// const [selectedBook, setSelectedBook] = useState(null)
// const [languageId, setLanguageId] = useState(null)
// const [pushAccess, setPushAccess] = useState(false)
//
// const bibleSubjects = [
//   'Aligned Bible',
//   'Bible',
//   'Hebrew Old Testament',
//   'Greek New Testament',
// ]
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

// useEffect(() => {
//   setSelectedOrganization(organization)
// }, [organization])

// useEffect(() => {
//   async function getLanguages() {
//     setLoading(true)
//     const response = await repoClient.repoSearch({
//       owner: selectedOrganization,
//       subject: bibleSubjects.join(','),
//     })
//     if (200 === response.status) {
//       setRepos(response.data.data)
//     }
//     setLoading(false)
//   }
//   if (repoClient) {
//     getLanguages().catch(console.error)
//   }
// }, [repoClient, selectedOrganization])
