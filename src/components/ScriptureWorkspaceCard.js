import { useEffect, useState, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Card, useCardState } from 'translation-helps-rcl'
import { UsfmEditor } from 'uw-editor'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import React from 'react'
import CircularProgress from './CircularProgress'
import FontDropdown from './FontDropdown'
import FontSizeDropdown from './FontSizeDropdown'
import LineHeightDropdown from './LineHeightDropdown'
import Button from '@mui/material/Button'
import { Grid } from "@mui/material"

const CustomToolbarCloseButton = ({onClick}) => {
  return <Button style={{maxWidth: '30px', maxHeight: '54px', minWidth: '30px', minHeight: '54px'}} sx={{fontSize: 30}} variant="contained" onClick={onClick}>×</Button>
}

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  docSetId,
  data,
  classes,
  onSave: saveToWorkspace,
  onClose: removeBook,
  isUnsaved,
}) {
  const [doSave, setDoSave] = useState(false)

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
    state: { books, repoClient, ep },
    actions: { setBooks },
  } = useContext(AppContext)

  const setUnsavedData = (value) => {
    let _books = [...books]
    let _count = 0
    console.log("setUnsavedData() id:", id, value)
    for (let i = 0; i < _books.length; i++) {
      if (_books[ i ].id === id) {
        _books[ i ].unsaved = value
        setBooks(_books)
      }
      if ( _books[i]?.unsaved === true ) {
        _count++
      }
    }
    sessionStorage.setItem("unsavedChanges", _count);
  }

  // Save Feature
  useEffect(() => {
    async function saveContent() {
      const url = URL.createObjectURL(new Blob([doSave]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${bookId}.usfm`
      a.click()
      URL.revokeObjectURL(url)
      setDoSave(null)
    }
    if (doSave) {
      console.log('New updated USFM:', doSave)
      saveToWorkspace(id, doSave)
      saveContent()
    }
  }, [
    doSave,
    books,
    setBooks,
    id,
    docSetId,
    data,
    owner,
    ep,
    repoClient,
    bookId,
  ])

  let title = ''
  if (BIBLE_AND_OBS[bookId.toLowerCase()]) {
    title += BIBLE_AND_OBS[bookId.toLowerCase()]
  }
  if (data.url) {
    title += ' (' + data.url + ')'
  } else {
    title += ' (' + id + ')'
  }
  console.log('owner and id:', owner, id)

  const [selectedFont, setSelectedFont] = useState('Ezra-shipped, Noto-Sans-shipped');
  const fontButton = useMemo(() => <FontDropdown selectedFont={selectedFont} setSelectedFont={setSelectedFont} />, [selectedFont]);

  const [selectedFontSize, setSelectedFontSize] = useState('1em');
  const fontSizeButton = useMemo(() => <FontSizeDropdown selectedFontSize={selectedFontSize} setSelectedFontSize={setSelectedFontSize} />, [selectedFontSize]);

  const [selectedLineHeight, setSelectedLineHeight] = useState('normal');
  const lineHeightButton = useMemo(() => <LineHeightDropdown selectedLineHeight={selectedLineHeight} setSelectedLineHeight={setSelectedLineHeight} />, [selectedLineHeight]);

  const {
    state: {
      filters,
      itemIndex,
    },
    actions: {
      setFilters,
      setItemIndex,
    }
  } = useCardState({
    items: []
  })

  //Example returning array
  const onRenderToolbar = ({items}) => [
    ...items,
    <Grid container spacing={0} sx={{p: 0}} key='fontsettings'>
      {fontButton}
      {fontSizeButton}
      {lineHeightButton}
    </Grid>,
    <CustomToolbarCloseButton
            key='close'
            id='card_close'
            onClick={removeBook} //Needs something else. Cannot be re-opened. Where is removeBook() defined?
          />
  ]

  return (
    <Card
      onRenderToolbar={onRenderToolbar}
      filters={filters}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setItemIndex={setItemIndex}
      title={title}
      classes={classes}
      hideMarkdownToggle={true}
      // closeable={true}
      onClose={() => removeBook(id)}
      key={bookId}
      disableSettingsButton={true}
    >  
    {
      // ep[docSetId]?.localBookCodes().includes(bookId.toUpperCase())
      data.usfmText
      ?
      <div style={{ fontFamily: selectedFont, fontSize: selectedFontSize, lineHeight: selectedLineHeight }}>
      <UsfmEditor key="1"
        bookId={data.bookId}
        docSetId={docSetId}
        usfmText={data.usfmText}
        onSave={ (bookCode,usfmText) => setDoSave(usfmText) }
        editable={id.endsWith(owner) ? true : false}
        onUnsavedData={setUnsavedData}
        // hasInitialUnsavedData={data.unsaved}
        activeReference={bibleReference}
        onReferenceSelected={onReferenceSelected}
      /></div>
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
