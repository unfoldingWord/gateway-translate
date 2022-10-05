import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
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
  const [ltStState, setLtStState] = useState('literal')
  const [url, setUrl] = useState(null)

  const handleLtStStateChange = event => {
    setLtStState(event.target.value)
  }

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleClickClose = () => {
    setShowModal(false)
  }

  const handleClickNext = () => {
    onNext({value, ltStState, url})
    handleClickClose()
  }

  const defaultProps = {
    options: bookSelectList(),
    getOptionLabel: (option) => option.name,
    getOptionSelected: (option, value) => option.id === value.id,
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
        <FormControl>
          <FormLabel id="literal-or-simplified">Literal or Simplified Translation?</FormLabel>
          <RadioGroup
            aria-labelledby="literal-or-simplified-radio-buttons-group-label"
            defaultValue="literal"
            name="literal-or-simplified-radio-buttons-group"
            row
            value={ltStState}
            onChange={handleLtStStateChange}
          >
            <FormControlLabel value="literal" control={<Radio />} label="Literal" />
            <FormControlLabel value="simplified" control={<Radio />} label="Simplified" />
            <FormControlLabel value="custom" control={<Radio />} label="Custom URL" />
          </RadioGroup>
        </FormControl>
        { ltStState === 'custom' ? <TextField label="Url" type="url" value={url} onChange={handleUrlChange} fullWidth="true" /> : '' }
        { ltStState !== 'custom' ?
        <Autocomplete
          {...defaultProps}
          id="select-book"
          value={value}
          onChange={(event, newValue) => {
            console.log("Autocomplete() onchange() setValue:", newValue)
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Select" margin="normal" />}
        /> : '' }
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
