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

  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp((`${highlight}`), 'gi'));
    return <span> { parts.map((part, i) => 
        <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold' } : {} }>
            { part }
        </span>)
    } </span>;
}

  return (
    <div>
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
        </DialogTitle>
        <DialogContent>
           {replace !== ''? replace?.map((value, index) => (
            // <Tooltip title={Object.keys(value)}>
            <ListItemButton key={index}>
                <ListItem disablePadding>
                {/* {console.log(Object.values(value)[0])} */}
                <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[search]}
                    autoEscape={true}
                    textToHighlight={Object.values(value)[0]} //'The they there'
                    // caseSensitive={true}
                 >
                </Highlighter>
                {/* {getHighlightedText('the they there The','the')} */}
                    {/* {Object.keys(value)}:{Object.values(value)} */}
                    
                </ListItem>
                <Tooltip title="Delete">
                    <ListItemButton onClick={() => {handleDeleteItem(value, index)}}>
                    <CloseIcon fontSize='small' color='red'/>
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Replace">
                <ListItemButton >
                    <PublishedWithChangesIcon/>
                </ListItemButton>
                </Tooltip>
            </ListItemButton>
           )):''}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleClose} autoFocus>
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
