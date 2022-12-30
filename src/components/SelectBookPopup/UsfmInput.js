import React, { useState } from 'react'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

export const createUsfmEntry = (entry, uploadedFilename, usfmData) => {
  let usfmEntry = { ...entry }
  const foundInFilename = uploadedFilename.match(/(?<bookId>[a-zA-Z_]*)\.usfm$/)
  if (foundInFilename) {
    usfmEntry.bookId = foundInFilename.groups.bookId
  } else {
    usfmEntry.bookId = foundInFilename.substr(-10)
  }
  usfmEntry.bookId = usfmEntry.bookId.substr(-3)
  usfmEntry.id = `${uploadedFilename}`
  usfmEntry.filename = `${uploadedFilename}`
  usfmEntry.usfmText = usfmData
  usfmEntry.readOnly = true
  return usfmEntry
}

const UsfmInput = ({ handleUsfmSubmit }) => {
  const [uploadedFilename, setUploadedFilename] = useState(null)
  const [loading, setLoading] = useState(false)
  const [usfmData, setUsfmData] = useState(null)

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

  return (
    <>
      <Button
        fullWidth
        component='label'
        variant='outlined'
        startIcon={<UploadFileIcon />}
      >
        Upload USFM file
        <input type='file' accept='.usfm' hidden onChange={handleFileUpload} />
      </Button>
      <LoadingButton
        loading={loading}
        size='large'
        color='primary'
        className='my-3'
        variant='contained'
        onClick={() => handleUsfmSubmit(uploadedFilename, usfmData)}
        loadingPosition='start'
        startIcon={<NoteAddIcon />}
      >
        Add
      </LoadingButton>
    </>
  )
}

export default UsfmInput
