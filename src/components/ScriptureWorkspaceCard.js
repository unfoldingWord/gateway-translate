import { useEffect, useState, useContext } from 'react'
import {
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { Editor } from 'uw-editor'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import React from 'react';
import CircularProgress from './CircularProgress'
import { saveToUserBranch } from '@utils/saveToUserBranch'
import { perf2usfm } from '@utils/perf2usfm'

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  docSetId,
  data,
  classes,
  onClose: removeBook,
}) {

  const [doSave, setDoSave] = useState(false)

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
        repoClient,
        ep,
    },
    actions: {
    }
  } = useContext(AppContext)

  // Save Feature
  useEffect(() => {
    async function saveContent() {
      // const _doc = ep[docSetId].getDocument( data.bookId.toUpperCase() )
      // const _usfm = perf2usfm(_doc)
      // console.log("useEffect() updated PERF:",JSON.stringify(_doc,null,4))
      const _usfm = await ep[docSetId].readUsfm( data.bookId.toUpperCase() )

      await saveToUserBranch(
        data,
        owner,
        _usfm,
        authentication,
        repoClient
      )
      setDoSave(false)
    }
    if ( doSave ) {
        saveContent()
    }
  }, [doSave, docSetId, data, owner, ep, authentication, repoClient])

  const editorProps = {
    epiteleteHtml: ep[docSetId],
    bookId: data.bookId,
    onSave: () => setDoSave(true),
    verbose: true
  }

  return (
    <Card title={`${BIBLE_AND_OBS[bookId]} (${id.split('-')[1]}-${id.split('-')[2]}-${id.split('-')[3]})`}
      classes={classes}
      hideMarkdownToggle={true}
      closeable={true}
      onClose={() => removeBook(id)}
      key={bookId}
      disableSettingsButton={true}
    >
      {
        ep[docSetId]?.localBookCodes().includes(bookId.toUpperCase())
        ?
        <div className="text-sm max-w-prose">
          <Editor key="1" {...editorProps} />
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



/* code graveyard

      {
        data.perf
        ?
        <div className="text-sm max-w-prose">
          <pre>{JSON.stringify(data.perf,null,4)}</pre>
        </div>
        :
        <CircularProgress/>

      }
*/
