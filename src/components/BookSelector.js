import React, {
  useContext, useEffect, useState,
} from 'react'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

import { StoreContext } from '@context/StoreContext'
import { bookSelectList } from '@common/BooksOfTheBible'
// import { AdminContext } from '@context/AdminContext'
// import { AuthenticationContext } from "gitea-react-toolkit"
// import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

export default function BookSelector() {
  const [value, setValue] = useState(null)
  const [status, setStatus] = useState(null)

  const classes = useStyles()

  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  // const {
  //   state: {
  //   },
  //   actions: {
  //   },
  // } = useContext(AdminContext)

  // const { state: authentication } = useContext(AuthenticationContext)
  const handleClickNext = () => {
    // onNext(value)
    // handleClickClose()
    setStatus("You selected: "+JSON.stringify(value))
  }

  const defaultProps = {
    options: bookSelectList(),
    getOptionLabel: (option) => option.name,
  };

  return (
    <>
      <Paper className='flex flex-col justify-center items-center'>
        <h1><b>Book Selection for Organization</b> <i>{organization}</i> <b>and Language ID</b> <i>{languageId}</i></h1>
        <div className='flex flex-col justify-between w-96 my-4'>
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
        </div>
        <p>{status}</p>
      </Paper>
    </>
  )
}

