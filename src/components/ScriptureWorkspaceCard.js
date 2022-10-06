import { useEffect, useState, useContext } from 'react'
import {
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import React from 'react';
import Editor from "./Editor";
import CircularProgress from './CircularProgress'
//import { makeStyles } from '@material-ui/core/styles';

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  data,
  classes,
  onClose: removeBook,
}) {

  const [usfmContent, setUsfmContent] = useState("Waiting...")

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  const { 
    state: {
        books,
    },
    actions: {
    }
  } = useContext(AppContext)


  const SaveToolbarButton = ({onSave}) => {
    return <SaveIcon
      id='toolbar-save'
      className={classes.pointerIcon}
      onClick={onSave}
    />
  }
  const UndoToolbarButton = ({onUndo}) => {
    return <UndoIcon
      id='toolbar-undo'
      className={classes.pointerIcon}
      onClick={onUndo}
    />
  }
  const RedoToolbarButton = ({onRedo}) => {
    return <RedoIcon
      id='toolbar-redo'
      className={classes.pointerIcon}
      onClick={onRedo}
    />
  }
  const items = []
  const onRenderToolbar = ({items}) => [
    ...items,
    <SaveToolbarButton key="save-button" onSave={ () => alert("Save Toolbar Button clicked") }/>,
    <UndoToolbarButton key="undo-button" onUndo={ () => alert("Undo Toolbar Button clicked") }/>,
    <RedoToolbarButton key="redo-button" onRedo={ () => alert("Redo Toolbar Button clicked") }/>
  ]

  return (
    <Card title={`${BIBLE_AND_OBS[bookId]} (${id.split('-')[1]})`} 
      classes={classes} 
      hideMarkdownToggle={true} 
      closeable={true}
      onClose={() => removeBook(id)}
      key={bookId}
      onRenderToolbar={onRenderToolbar}
      disableSettingsButton={true}
    >
      {/* <Editor/> */}
      {
        data.usfmText 
        ?
        <div className="text-sm max-w-prose">
          <pre>{data.usfmText}</pre>
        </div>
        :
        <CircularProgress/>

      }
    </Card>
  )
}

ScriptureWorkspaceCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

