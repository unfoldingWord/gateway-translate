import { useEffect, useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { UsfmEditor } from 'uw-editor'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import React from 'react';
import Button from '@mui/material/Button'
import { MdUpdate } from 'react-icons/md'
import { FiShare } from 'react-icons/fi'
import CircularProgress from './CircularProgress'
import { saveToUserBranch } from '@utils/saveToUserBranch'

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  docSetId,
  data,
  classes,
  onClose: removeBook,
  unSavedData,
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

  let title = '';
  if ( BIBLE_AND_OBS[bookId.toLowerCase()] ) {
    title += BIBLE_AND_OBS[bookId.toLowerCase()];
  }
  if ( data.url ) {
    title += " (" + data.url + ")"
  } else {
    title += " (" + id.substr(4) + ")"
  }

  // const updateButtonDisabled = () => {
  //   if ( unSavedData ) {
  //     return true // disable buttons until they have saved their changes
  //   }
  //   if ( !data.branchExists ) {
  //     // if there is no branch then we can't make a PR
  //     // thus update/merge are not meaningful
  //     return true 
  //   }
  // }
  // const mergeButtonDisabled = () => {
  //   if ( unSavedData ) {
  //     return true // disable buttons until they have saved their changes
  //   }
  //   if ( !data.branchExists ) {
  //     // if there is no branch then we can't make a PR
  //     // thus update/merge are not meaningful
  //     return true 
  //   }
  // }

  // const onRenderToolbar = ({items}) =>
  // <>
  //   <Button disabled={() => updateButtonDisabled()}>Update</Button>
  //   <Button disabled={() => mergeButtonDisabled() }>Merge</Button>
  //   <Button onClick={() => removeBook(id)}>Close</Button>
  // </>

  const needToMergeFromMaster = true;
  const mergeFromMasterHasConflicts = false;
  const mergeToMasterHasConflicts = true;

  // eslint-disable-next-line no-nested-ternary
  const mergeFromMasterTitle = mergeFromMasterHasConflicts
    ? 'Merge Conflicts for update from master'
    : needToMergeFromMaster
      ? 'Update from master'
      : 'No merge conflicts for update with master';
  // eslint-disable-next-line no-nested-ternary
  const mergeFromMasterColor = mergeFromMasterHasConflicts
    ? 'red'
    : needToMergeFromMaster
      ? 'orange'
      : 'lightgray';
  const mergeToMasterTitle = mergeToMasterHasConflicts
    ? 'Merge Conflicts for share with master'
    : 'No merge conflicts for share with master';
  const mergeToMasterColor = mergeToMasterHasConflicts ? 'red' : 'black';

  const onRenderToolbar = ({ items }) => [
    ...items,
    <Button
      key="update-from-master"
      value="update-from-master"
      onClick={() => {}}
      title={mergeFromMasterTitle}
      aria-label={mergeFromMasterTitle}
      style={{ cursor: 'pointer' }}
    >
      <MdUpdate id="update-from-master-icon" color={mergeFromMasterColor} />
    </Button>,
    <Button
      key="share-to-master"
      value="share-to-master"
      onClick={() => {}}
      title={mergeToMasterTitle}
      aria-label={mergeToMasterTitle}
      style={{ cursor: 'pointer' }}
    >
      <FiShare id="share-to-master-icon" color={mergeToMasterColor} />
    </Button>,
  ];

  const editorProps = {
    // repoIdStr,
    // langIdStr,
    bookId: data.bookId,
    docSetId: docSetId,
    usfmText: data.usfmText,
    onSave: (bookCode,usfmText) => setDoSave(usfmText),
    editable: id.endsWith(owner) ? true : false,
    onRenderToolbar,
    verbose: true,
  }

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
          <UsfmEditor key="1" {...editorProps} />
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

/*
  const onRenderToolbar = ({items}) =>
    <>
      {...items}
      <Button>Another button</Button>
      <Button onClick={() => setOpen(false)}>X</Button>
    </>


              <UsfmEditor key="1"
            bookId={data.bookId}
            docSetId={docSetId}
            usfmText={data.usfmText}
            onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
            editable={id.endsWith(owner) ? true : false}
            // commenting out this code for v0.9
            // see issue 152
            // activeReference={bibleReference}
            // onReferenceSelected={onReferenceSelected}
          />
*/
