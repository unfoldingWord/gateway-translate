import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'
import { bookSelectList } from '@common/BooksOfTheBible'

export default function SelectBookPopup(
{
  onNext,
  showModal,
  setShowModal,
}) {

  const [value, setValue] = useState(null)

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleClickNext = () => {
    onNext(value)
    handleClickClose()
  }

  const defaultProps = {
    options: bookSelectList(),
    getOptionLabel: (option) => option.name,
  };

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
          root: 'w-96'
        }}
      >
        <Autocomplete
          {...defaultProps}
          id="select-book"
          value={value}
          onChange={(event, newValue) => {
            console.log("Autocomplete() onchange() setValue:", newValue)
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Select" margin="normal" />}
        />        
        <Button
          size='large'
          color='primary'
          className='my-3'
          variant='contained'
          onClick={handleClickNext}
        >
          Next
        </Button>
      </Card>
    </DraggableModal>
  )
}

SelectBookPopup.propTypes = {
  /** On next button click event handler */
  onNext: PropTypes.func,
}
