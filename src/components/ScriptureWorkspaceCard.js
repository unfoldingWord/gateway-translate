import { useEffect, useState, useContext } from 'react'
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
      setBooks,
    }
  } = useContext(AppContext)

  // Save Feature
  useEffect(() => {
    async function saveContent() {
      const _doc = ep[docSetId].getDocument( data.bookId.toUpperCase() )
      console.log("useEffect() updated PERF:\n",JSON.stringify(_doc,null,4))
      const _usfm = await ep[docSetId].readUsfm( data.bookId.toUpperCase() )

      const _content = await saveToUserBranch(
        data,
        owner,
        _usfm,
        authentication,
        repoClient
      )
      let _books = books
      for ( let i=0; i<_books.length; i++ ) {
        if ( _books[i].id = id ) {
          _books[i].content = _content
          setBooks(_books)
          break
        }
      }
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
    verbose: false,
  }

  let title = '';
  const idParts = id.split('-');
  if ( BIBLE_AND_OBS[bookId] ) {
    title += BIBLE_AND_OBS[bookId];
    idParts.shift()
  }
  title += '('+idParts.join('-')+')'

  return (
    <Card title={title}
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
        (
          typeof data.content === "string"
          ?
          <div><h1>{data.content}</h1></div>
          :
          <CircularProgress/>
        )

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
