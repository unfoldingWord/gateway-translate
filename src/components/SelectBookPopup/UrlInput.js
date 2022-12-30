import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import { randomLetters } from '@utils/randomLetters'

export const createUrlEntry = (entry, url) => {
  let urlEntry = { ...entry }
  const _owner = randomLetters(3)
  const _lang = randomLetters(2)
  const found = url.match(/[-_\/](?<bookId>[a-zA-Z_]*)\.usfm$/)
  if (found) {
    urlEntry.bookId = found.groups.bookId
  } else {
    urlEntry.bookId = url.substr(-10)
  }
  urlEntry.bookId = urlEntry.bookId.substr(-3)
  urlEntry.id = `${urlEntry.bookId}-${_owner}-${_lang}`
  urlEntry.url = url
  urlEntry.readOnly = true
  return urlEntry
}

const UrlInput = ({ handleUrlSubmit }) => {
  const [url, setUrl] = useState('')

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleClick = () => {
    setUrl('')
    handleUrlSubmit(url)
  }

  return (
    <>
      <TextField
        label='Url'
        type='url'
        value={url}
        onChange={handleUrlChange}
        fullWidth={true}
      />
      <LoadingButton
        loading={false}
        size='large'
        color='primary'
        className='my-3'
        variant='contained'
        onClick={handleClick}
        loadingPosition='start'
        startIcon={<NoteAddIcon />}
      >
        Add
      </LoadingButton>
    </>
  )
}

export default UrlInput
