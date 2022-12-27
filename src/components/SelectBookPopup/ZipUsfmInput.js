import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useZipUsfmFileInput } from 'zip-project'

import CircularProgress from '@components/CircularProgress'

const ZipUsfmInput = ({ handleZipLoad }) => {
  const [invalidZipNotice, setInvalidZipNotice] = useState(false)
  const [invalidZipMessage, setInvalidZipMessage] = useState('')

  const {
    isLoading,
    invalidFileType,
    uploadError,
    onChange,
    onSubmit,
    triggerReload,
  } = useZipUsfmFileInput(handleZipLoad, true)

  const handleInvalidZipNoticeClose = () => {
    setInvalidZipNotice(false)
    setInvalidZipMessage('')
  }

  if (invalidFileType.length !== 0) {
    setInvalidZipNotice(true)
    setInvalidZipMessage(invalidFileType.slice())
    triggerReload()
    return <div></div>
  }

  if (uploadError) throw new Error(uploadError.message)

  if (isLoading)
    return (
      <>
        <CircularProgress size={180} />
        <LoadingButton
          loading={isLoading}
          size='large'
          color='primary'
          className='my-3'
          variant='contained'
          onClick={onSubmit}
          loadingPosition='start'
          startIcon={<NoteAddIcon />}
        >
          Add
        </LoadingButton>
      </>
    )

  return (
    <>
      <Button
        fullWidth
        component='label'
        variant='outlined'
        startIcon={<DriveFolderUploadIcon />}
      >
        Upload Zipped USFM Files
        <input type='file' accept='.zip' hidden onChange={onChange} />
      </Button>
      <LoadingButton
        loading={isLoading}
        size='large'
        color='primary'
        className='my-3'
        variant='contained'
        onClick={onSubmit}
        loadingPosition='start'
        startIcon={<NoteAddIcon />}
      >
        Add
      </LoadingButton>
      <Snackbar
        open={invalidZipNotice}
        autoHideDuration={6000}
        onClose={handleInvalidZipNoticeClose}
        message={invalidZipMessage}
      />
    </>
  )
}

export default ZipUsfmInput
