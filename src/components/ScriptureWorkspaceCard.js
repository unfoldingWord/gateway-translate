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
import { MergeBranchButton } from './branch-merger/components/MergeBranchButton'
import { UpdateBranchButton } from './branch-merger/components/UpdateBranchButton'
import MergeDialog from './branch-merger/components/MergeDialog'
import { saveToUserBranch } from '@utils/saveToUserBranch'

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  data,
  classes,
  onClose: removeBook,
  unSavedData,
}) {

  const [doSave, setDoSave] = useState(false)
  const [open, setOpen] = useState(false)
  const [merge, setMerge] = useState(null)

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

  const handleClose = () => {
    setOpen(false)
  }

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
            _books[i].branchExists = _content.branchExists
            _books[i].branchName = _content.branchName
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

  const handleMergeClick = () => {
    setMerge(true)
    setOpen(true)
  }
  const handleUpdateClick = () => {
    setMerge(false)
    setOpen(true)
  }
  

  const onRenderToolbar = ({ items }) => [
    ...items,
    <MergeBranchButton key="1" onClick={handleMergeClick}/>,
    <UpdateBranchButton key="2" onClick={handleUpdateClick}/>
  ];

  console.log("data:", data)
  console.log("unSavedData:", unSavedData)
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
        data.usfmText
        ?
          <PkUsfmEditor key="1"
            bookId={data.bookId}
            repoIdStr={data.docset}
            langIdStr={data.languageId}
            usfmText={data.usfmText}
            onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
            editable={id.endsWith(owner) ? true : false}
            onRenderToolbar={onRenderToolbar}
            verbose={true}
            // commenting out this code for v0.9
            // see issue 152
            // activeReference={bibleReference}
            // onReferenceSelected={onReferenceSelected}
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
      {
        <MergeDialog merge={merge} open={open} onCancel={handleClose} />
      }
    </Card>
  )
}

ScriptureWorkspaceCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
