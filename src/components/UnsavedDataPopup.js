import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import LoadingButton from '@mui/lab/LoadingButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'
import { Button } from '@mui/material'

export default function UnsavedDataPopup(
{
  id,
  bookId,
  showModal,
  setShowModal,
  onDiscard,
}) {

  const handleClickClose = () => {
    setShowModal(false)
  }
  console.log("UnsavedDataPopup() showModal=", showModal)
  return (
    <DraggableModal
      open={showModal}
      handleClose={handleClickClose}
    >
      <Card
        closeable
        title={`Warning! Unsaved Data!`}
        onClose={handleClickClose}
        onDiscard={ () => onDiscard(id) }
        classes={{
          dragIndicator: 'draggable-dialog-title',
          root: 'w-104'
        }}
      >
        <p>Book Id={bookId}</p>
        <p>Id={id}</p>
        <Button onClick={handleClickClose}>Keep my data, I'll save it later</Button>
        <Button onClick={ () => onDiscard(id) }>Discard my changes</Button>
      </Card>
    </DraggableModal>
  )
}

