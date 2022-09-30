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


export default function SearchAndReplace() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState([]);
  const [searchText, setSearchText] = React.useState();
  const [replace, setReplace] = React.useState();
  const [replaceText, setReplaceText] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onNameChange = (e) => {
    setSearch(e.target.value)
  }

//   const {replace, setReplace, setSearchText} = useSearchAndReplace(search)

  const handleClose = () => {
    setSearch()
    setReplace([])
    setOpen(false);
  };

  useEffect(() => {
    console.log(search)
    if(searchAndReplaceData.text === search){
    const searchTextOccurences = searchAndReplaceData.occurences
    setReplace(searchTextOccurences)
    // console.log(searchTextOccurences)
    }else{
    setReplace()
    }
  },[search, replace])

  useEffect(() => {

  },[replace])

  const handleDeleteItem =(item, index) => {
    console.log(item, index)
    setReplace(replace.splice(index,1))
    console.log("current state",replace)
  }

    const searchAndReplace = (() => {

    })

    const onReplaceText = ((e) => {
        setReplaceText(e.target.value)
    })

    const onReplaceAll = (() => {

    })

    const onReplace = ((search, replaceText, item, index) => {
        console.log("onReplace",search,replaceText,item, index)
    })

  return (
    <div>
        {console.log("replaceText",replaceText)}
      <Button variant="outlined" onClick={handleClickOpen}>
        Search and Replace
      </Button>
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
            label='Name'
            autoComplete='name'
            // defaultValue={state.name}
            variant='outlined'
            onChange={onNameChange}
            // classes={{ root: classes.textField }}
          />
        <TextField
            id='name-feedback-form'
            type='given-name'
            label='Name'
            autoComplete='name'
            // defaultValue={state.name}
            variant='outlined'
            onChange={onReplaceText}
            // classes={{ root: classes.textField }}
          />
        </DialogTitle>
        <DialogContent>
           {replace !== ''? replace?.map((value, index) => (
            <ListItemButton key={index}>
                <ListItem disablePadding>
                <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[search]}
                    autoEscape={true}
                    textToHighlight={Object.values(value)[0]} //'The they there'
                    // caseSensitive={true}
                 >
                </Highlighter>
                </ListItem>
                <Tooltip title="Delete">
                    <ListItemButton onClick={() => {handleDeleteItem(value, index)}}>
                    <CloseIcon fontSize='small' color='red'/>
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Replace">
                <ListItemButton onClick={() => {onReplace(search,replaceText,value, index)}}>
                    <PublishedWithChangesIcon/>
                </ListItemButton>
                </Tooltip>
            </ListItemButton>
           )):''}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => {onReplaceAll()}} autoFocus>
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
