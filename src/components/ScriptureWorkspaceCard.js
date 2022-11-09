import { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { UsfmEditor } from 'uw-editor'
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
      const _content = await saveToUserBranch(
        data,
        owner,
        doSave,
        authentication,
        repoClient
      )
      let _books = books
      for ( let i=0; i<_books.length; i++ ) {
        if ( _books[i].id === id ) {
          _books[i].content = _content
          setBooks(_books)
          break
        }
      }
      setDoSave(null)
    }
    if ( doSave ) {
      console.log("New updated USFM:", doSave)
        saveContent()
    }
  }, [doSave, books, setBooks, id, docSetId, data, owner, ep, authentication, repoClient])

  const editorProps = {
    onSave: (bookCode,usfmText) => setDoSave(usfmText),
    docSetId,
    // usfmText: data.usfmText,
    bookId: data.bookId,
  }
  
  let title = '';
  if ( BIBLE_AND_OBS[bookId.toLowerCase()] ) {
    title += BIBLE_AND_OBS[bookId.toLowerCase()];
  }
  if ( data.url ) {
    title += " (" + data.url + ")"
  } else {
    title += " (" + id.substr(4) + ")"
  }

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
        // ep[docSetId]?.localBookCodes().includes(bookId.toUpperCase())
        data.usfmText
        ?
          <div className="text-sm max-w-prose">
          <UsfmEditor key="1" 
            bookId={data.bookId} 
            docSetId={docSetId}
            usfmText={data.usfmText}
            onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
          />
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
/*

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
        if ( _books[i].id === id ) {
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
*/