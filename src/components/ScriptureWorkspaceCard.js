import { useEffect, useState, useContext, useCallback, createElement } from 'react'
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
  isUnsaved,
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

  const activeReference = {
    bookId: bookId.toLowerCase(),
    chapter: Number(bibleReference.chapter),
    verse: Number(bibleReference.verse),
  }

  const onReferenceSelected = ({bookIdFromEditor, chapter, verse}) => {
    const normalizedBookId = (bookIdFromEditor || bookId).toLowerCase()
    onReferenceChange(normalizedBookId, chapter.toString(), verse.toString())
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

  const findBookEntry = useCallback(() => {
    let _books = [...books]
    for (let i = 0; i < _books.length; i++) {
      if (_books[i].id === id) {
        return _books[i]
      }
    }
    return null
  },[id,books])

  const setUnsavedData = useCallback((value,bookId) => {
    const _trace = `ScriptureWorkspaceCard.js/setUnsavedData(${value},${bookId})`
    let _count = 0 // count of unsaved items
    let _itemChanged = false // did this card actually change the unsaved status?
    const bkEntry = findBookEntry()
    if (bkEntry) {
      // found this book
      // test to see if needs to be changed or not
      if ( bkEntry?.unsaved === value ) {
        // no change is needed
        console.log(_trace+": no value change needed:", value)
      } else {
        bkEntry.unsaved = value
        bkEntry.trace = _trace
        console.log(_trace+": value change is needed:", value)
        // bump the change count
        _itemChanged = true
      }
      if ( bkEntry.unsaved === true ) {
        _count++
      }
    }
    if (_itemChanged) {
      console.log(_trace+": changes were made:")
      setBooks(_books)
    } else {
      console.log(_trace+": no changes made:")
    }
    sessionStorage.setItem("unsavedChanges", _count);
  },[findBookEntry, setBooks])

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

!!! Check this - how to untie the dependency with unstructured data in books
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
  }, [doSave, books, setBooks, id, docSetId, data, owner, ep, authentication, repoClient, bookId])

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
          <UsfmEditor key="1"
            bookId={data.bookId}
            docSetId={docSetId}
            usfmText={data.usfmText}
            onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
            editable={id.endsWith(owner) ? true : false}
            onUnsavedData={(hasUnsavedData) => setUnsavedData(hasUnsavedData,data.bookId)}
            activeReference={bibleReference}
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
