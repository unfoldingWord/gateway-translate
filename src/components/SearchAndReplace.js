import { useEffect } from 'react'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import searchreplace from 'searchreplace-oce';


export default function SearchAndReplace({baseText, onReplace}) {
  const [open, setOpen] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [searchText, setSearchText] = React.useState(baseText);
  const [replace, setReplace] = React.useState('');
  const [replaceOccurrences, setReplaceOccurrences ] = React.useState()
  const [state, setState] = React.useState(replaceOccurrences);
  const [valueIndecies, setValueIndecies] = React.useState([])
   
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleChange = (value, index) => {
    setValueIndecies((valueIndecies)=>[...valueIndecies, index]);
  };
  
  //   const {replace, setReplace, setSearchText} = useSearchAndReplace(searchWord)
  
  const handleClose = () => {
    setSearchWord()
    setOpen(false);
  };
  
  useEffect(() => {
    const {replacedText, occurrences} = searchreplace({ baseText: searchText, replaceText: replace, searchText: searchWord, replaceIndexes: [] });
    setReplaceOccurrences(occurrences)
  }, [searchWord, replace, searchText])
  
  const handleDeleteItem = (item, index) => {
    setReplaceOccurrences(replaceOccurrences.splice(index, 1))
  }

  const onHandleReplace = () => {
    const {replacedText, occurrences} = searchreplace({ 
      baseText: searchText, 
      replaceText: replace, 
      searchText: searchWord, 
      replaceIndexes: valueIndecies });
    setReplaceOccurrences(occurrences);
    setSearchText(replacedText);
    onReplace(replacedText);
    setValueIndecies([]);
  }
  
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
            onChange={(e) => { setReplace(e.target.value) }}
          // classes={{ root: classes.textField }}
          />
        </DialogTitle>
        <DialogContent>
          <h4>{replaceOccurrences?.length}</h4>
          {replaceOccurrences !== '' ? replaceOccurrences?.map((value, index) => (
            <ListItemButton key={index}>
              <ListItem disablePadding>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[searchWord]}
                  autoEscape={true}
                  textToHighlight={Object.values(value)[0]} //'The they there'
                // caseSensitive={true}
                >
                </Highlighter>
              </ListItem>
              <Tooltip title="Replace">
                <ListItemButton >
                <Checkbox checked={valueIndecies.includes(index)} onChange={()=>{handleChange(value, index)}} />
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
        <DialogActions>
          <Button onClick={onHandleReplace}>Replace</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
