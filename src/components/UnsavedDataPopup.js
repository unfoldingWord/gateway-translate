import React, { useState, useContext, useEffect } from 'react'

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'
import { Button } from '@mui/material'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'

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

  return (
    <DraggableModal
      open={showModal}
      handleClose={handleClickClose}
    >
      <Card
        closeable
        title={`Warning! Unsaved Data!`}
        onClose={handleClickClose}
        // onDiscard={ () => onDiscard(id) }
        classes={{
          dragIndicator: 'draggable-dialog-title',
          root: 'w-104'
        }}
      >
        <p>The Book of {ALL_BIBLE_BOOKS[bookId.toLowerCase()]} from <em>{id}</em> has unsaved changes.</p>
        <Button onClick={() => onDiscard(id)} >
          Continue
        </Button>
        <Button onClick={handleClickClose} >
          Cancel
        </Button>
      </Card>
    </DraggableModal>
  )
}

