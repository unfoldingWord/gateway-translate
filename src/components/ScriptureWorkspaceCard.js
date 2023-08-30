import { useEffect, useState, useContext } from 'react'
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
import { Box } from '@mui/material'

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
      setBibleReference,
    },
    bRefActions
  } = useContext(StoreContext)

  const onRefSelectClick = ({sourceId, bookId: bookIdFromEditor, chapter, verse}) => {
    const normalizedBookId = (bookIdFromEditor || bookId).toLowerCase()
    setBibleReference({ sourceId, bookId, chapter, verse })
    bRefActions.goToBookChapterVerse(bookId.toLowerCase(), chapter.toString(), verse.toString())
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
    <Card
      title={title}
      classes={classes}
      hideMarkdownToggle={true}
      closeable={true}
      onClose={() => removeBook(id)}
      key={bookId}
      disableSettingsButton={true}
    >
      <Box sx={{ background: 'white' }}>
        {
          // ep[docSetId]?.localBookCodes().includes(bookId.toUpperCase())
          data.usfmText ? (
            <PkUsfmEditor
              key='1'
              bookId={data.bookId}
              repoIdStr={data.docset}
              langIdStr={data.languageId}
              usfmText={data.usfmText}
              onSave={(bookCode, usfmText) => setDoSave(usfmText)}
              editable={id.endsWith(owner) ? true : false}
              reference={bibleReference}
              onReferenceSelected={onRefSelectClick}
            />
          ) : typeof data.content === 'string' ? (
            <div>
              <h1>{data.content}</h1>
            </div>
          ) : (
            <CircularProgress />
          )
        }
      </Box>
    </Card>
  )
}

ScriptureWorkspaceCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
