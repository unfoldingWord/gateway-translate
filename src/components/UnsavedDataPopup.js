import React, { useState, useContext, useEffect } from 'react'

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
        <Button onClick={handleClickClose}>
          Keep my data, I&apos;ll save it later
        </Button>
        <Button onClick={ () => onDiscard(id) }>
          Discard my changes
        </Button>
      </Card>
    </DraggableModal>
  )
}

