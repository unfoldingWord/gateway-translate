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
  data: cardParams,
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
    bRefActions.applyBooksFilter([normalizedBookId])
    /*
      Noah:
        See my comment in src/context/StoreContext.js about `chapter?.toString()`.

        We're repeating ourselves here... and so I'd like to submit this as evidence
        to strengthen the case I am making in that comment.

        This is also a great place to maybe do a small refactor across the app (if not
        now then at least we have this comment).

      Lars:
        Like in my comment in StoreContext.js I agree in principle about the need,
        but the proper place to do this is in bible-reference-rcl, not here
    */
    bRefActions.goToBookChapterVerse(normalizedBookId, chapter?.toString(), verse?.toString())
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
      if ( cardParams.readOnly ) {
        const url = URL.createObjectURL(new Blob([doSave]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${bookId}.usfm`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const _content = await saveToUserBranch(
          cardParams,
          cardParams.owner,
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
  }, [doSave, books, setBooks, id, cardParams, owner, ep, authentication, repoClient, bookId])

  let title = '';
  if ( BIBLE_AND_OBS[bookId.toLowerCase()] ) {
    title += BIBLE_AND_OBS[bookId.toLowerCase()];
  }
  if ( cardParams.url ) {
    title += " (" + cardParams.url + ")"
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
      key={cardParams.id}
      disableSettingsButton={true}
    >
      <Box sx={{ background: 'white' }}>
        {
          // ep[docSetId]?.localBookCodes().includes(bookId.toUpperCase())
          cardParams.usfmText ? (
            <PkUsfmEditor
              bookId={cardParams.bookId}
              repoIdStr={cardParams.docset}
              langIdStr={cardParams.languageId}
              usfmText={cardParams.usfmText}
              onSave={(bookCode, usfmText) => setDoSave(usfmText)}
              editable={id.endsWith(owner) ? true : false}
              reference={bibleReference}
              onReferenceSelected={onRefSelectClick}
            />
          ) : typeof cardParams.content === 'string' ? (
            <div>
              <h1>{cardParams.content}</h1>
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
