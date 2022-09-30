import { useEffect } from 'react'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@material-ui/core/TextField';
import useSearchAndReplace from '../hooks/useSearchAndReplace'
import searchAndReplaceData from '../data/searchAndReplaceData.json';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { key } from 'localforage';
import ListItemButton from '@mui/material/ListItemButton';
import CloseIcon from '@mui/icons-material/Close';
import Highlighter from "react-highlight-words";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import Tooltip from '@mui/material/Tooltip';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Grid from "@material-ui/core/Grid";
import IconButton from '@mui/material/IconButton';

export default function SearchAndReplace() {
  const [open, setOpen] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState([]);
  const [searchText, setSearchText] = React.useState();
  const [replace, setReplace] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const onSearch = (e) => {
  //   setSearchWord(e.target.value)

  // }

  //   const {replace, setReplace, setSearchText} = useSearchAndReplace(searchWord)

  const handleClose = () => {
    setSearchWord()
    setReplace([])
    setOpen(false);
  };

  useEffect(() => {
    // setReplace(searchAndReplaceData.occurences)
    if (searchAndReplaceData.text === searchWord) {
      const searchTextOccurences = searchAndReplaceData.occurences
      // console.log("trigger", searchWord)
      setReplace(searchTextOccurences)
      // console.log(searchTextOccurences)
    } else {
      setReplace('')
    }
  }, [searchWord, replace])

  // useEffect(() => {

  // },[replace])

  const handleDeleteItem = (item, index) => {
    // console.log(item, index)
    setReplace(replace.splice(index, 1))
    // console.log("current state", replace)
  }

  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp((`${highlight}`), 'gi'));
    return <span> {parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold' } : {}}>
        {part}
      </span>)
    } </span>;
  }

  console.log("onSearchKeyWord", searchWord)

  return (
    <div>
      <FindReplaceIcon variant="outlined" style={{ marginRight: '25px' }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <TextField
            id='name-feedback-form'
            type='given-name'
            label='Search'
            autoComplete='name'
            variant='outlined'
            onChange={(e) => { setSearchWord(e.target.value) }}
          />
          <ChevronRightIcon style={{ margin: '8px',marginTop:'18px' }} />
          <TextField
            id='name-feedback-form'
            type='given-name'
            label='Replace'
            autoComplete='name'
            // defaultValue={state.name}
            variant='outlined'
            onChange={(e) => { setSearchWord(e.target.value) }}
          // classes={{ root: classes.textField }}
          />

          {replace &&
            // <Grid container justify="center">
              <IconButton style={{marginRight:'20px', marginBottom:'20px'}}>
                <Tooltip title="Replace All">
                  <DoneAllIcon color="primary" fontSize='medium' onClick={handleClose} />
                </Tooltip>
              </IconButton>
            // </Grid>
          }
        </DialogTitle>
        <DialogContent>
          {replace !== '' ? replace?.map((value, index) => (
            // <Tooltip title={Object.keys(value)}>
            <ListItemButton key={index}>
              <ListItem disablePadding>
                {/* {console.log(Object.values(value)[0])} */}
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[searchWord]}
                  autoEscape={true}
                  textToHighlight={Object.values(value)[0]} //'The they there'
                // caseSensitive={true}
                >
                </Highlighter>
                {/* {getHighlightedText('the they there The','the')} */}
                {/* {Object.keys(value)}:{Object.values(value)} */}

              </ListItem>
              <Tooltip title="Replace">
                <ListItemButton >
                  <DoneIcon fontSize='small' />
                </ListItemButton>
              </Tooltip>
              <Tooltip title="Delete">
                <ListItemButton onClick={() => { handleDeleteItem(value, index) }}>
                  <CloseIcon fontSize='small' color='red' />
                </ListItemButton>
              </Tooltip>
            </ListItemButton>
          )) : ''}
        </DialogContent>
        {/* {replace &&
          <Grid container justify="center">
            <IconButton>
              <Tooltip title="Replace All">
                <DoneAllIcon color="primary" fontSize='medium' onClick={handleClose} />
              </Tooltip>
            </IconButton>
          </Grid>
        } */}
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
