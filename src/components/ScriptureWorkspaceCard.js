import { useEffect, useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { PkUsfmEditor } from '@oce-editor-tools/pk'
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
      bibleReference,
    },
    actions: {
      onReferenceChange,
    }
  } = useContext(StoreContext)

  const reference = {
    bookId: bookId.toLowerCase(),
    chapter: Number(bibleReference.chapter),
    verse: Number(bibleReference.verse),
  }

  const onReferenceSelected = ({sourceId, bookId: bookIdFromEditor, chapter, verse}) => {
    const normalizedBookId = (bookIdFromEditor || bookId).toLowerCase()
    onReferenceChange(normalizedBookId, chapter.toString(), verse.toString(), sourceId)
  }

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
      if ( data.readOnly ) {
        const url = URL.createObjectURL(new Blob([doSave]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${bookId}.usfm`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const _content = await saveToUserBranch(
          data,
          data.owner,
          doSave,
          authentication,
          repoClient
        )
        let _books = [...books]
        const _trace = "ScriptureWorkspaceCard.js/useEffect()/saveContent()"
        for (let i = 0; i < _books.length; i++) {
          if (_books[ i ].id === id) {
            _books[ i ].content = _content
            _books[i].trace = _trace
            setBooks(_books)
            break
          }
        }
      }
      setDoSave(null)
    }
    if ( doSave ) {
      saveContent()
    }
  }, [doSave, books, setBooks, id, data, owner, ep, authentication, repoClient, bookId])

  // const editorProps = {
  //   onSave: (bookCode,usfmText) => setDoSave(usfmText),
  //   docSetId,
  //   // usfmText: data.usfmText,
  //   bookId: data.bookId,
  // }

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
          <PkUsfmEditor key="1"
            bookId={data.bookId}
            repoIdStr={data.docset}
            langIdStr={data.languageId}
            usfmText={data.usfmText}
            onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
            editable={id.endsWith(owner) ? true : false}
            reference={bibleReference}
            onReferenceSelected={onReferenceSelected}
          />
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
