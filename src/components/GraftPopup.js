import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'
import { HtmlPerfEditor } from "@xelah/type-perf-html";

export default function GraftPopup(graftProps) {
  console.log(graftProps)
  const {
    graftSequenceId,
    setGraftSequenceId,
  } = graftProps

  const handleClickClose = () => {
    setGraftSequenceId(null)
  }

  return (
    <DraggableModal
      open={graftSequenceId !== null}
      handleClose={handleClickClose}
    >
      <Card
        closeable
        title={`Edit a Graft`}
        onClose={handleClickClose}
        classes={{
          dragIndicator: 'draggable-dialog-title',
          root: 'w-96'
        }}
      >
        { graftSequenceId ? <HtmlPerfEditor key="2" {...graftProps} verbose={true} /> : ''}
        <Button
          size='large'
          color='primary'
          className='my-3'
          variant='contained'
          onClick={handleClickClose}
        >
          Done
        </Button>
      </Card>
    </DraggableModal>
  )
}
