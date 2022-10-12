import { useEffect, useState } from 'react'
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
  const [replaceOccurrences, setReplaceOccurrences ] = React.useState();
  const [state, setState] = React.useState(replaceOccurrences);
  const [valueIndecies, setValueIndecies] = React.useState([])
  const [selectAll, setSelectAll] = React.useState(false);
  const [select, setSelect] = React.useState(false);
  const [checked, setChecked] = useState([]);
   
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleChange = (e) => {
    const index = checked.indexOf(e.target.value)
    if(index === -1){
      setChecked([...checked, e.target.value])
    }else{
      setChecked((checked.filter(check => check !== e.target.value)))
    }
    // setValueIndecies((valueIndecies)=>[...valueIndecies, index]);
  };
  console.log(checked)
  
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

  const handleSelectAll = (e) => {
    const checkValue = e.target.checked;
    const indexArray = [];
    if (checkValue) {
      replaceOccurrences.forEach((value, index) => {
        const currentBook = index;
        if (!valueIndecies.includes(currentBook)) {
          indexArray.push(index);
        }
      });
    }
    console.log(indexArray)
    setValueIndecies(indexArray);
    setSelectAll(e.target.checked);
  };

  const handleSelect = (e) => {
    const checkValues = e.target.checked;
    const indecesArray = [];
    if (checkValues) {
      replaceOccurrences.forEach((value, index) => {
        const currentBook = index;
        if (!valueIndecies.includes(currentBook)) {
          indecesArray.push(index);
        }
      });
    }
    setValueIndecies(indecesArray);
    setSelect(e.target.checked);
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
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <h4>{replaceOccurrences?.length}</h4>
            </Grid>
            <Grid item xs={4}>
            <Checkbox onChange={handleSelectAll} checked={selectAll}/>
            </Grid>
            </Grid>
          {replaceOccurrences !== '' ? replaceOccurrences?.map((value, index) => (
            <ListItemButton key={index}>
              <Tooltip title="Replace">
                {/* <Checkbox checked={valueIndecies.includes(index)} onChange={()=>{handleChange(value, index)}} /> */}
                <Checkbox value={index} checked={checked.includes(index)} onChange={handleChange} />
                {/* </ListItemButton> */}
              </Tooltip>
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
