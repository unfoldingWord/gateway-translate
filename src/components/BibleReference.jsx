import React, { useState, useContext } from 'react'
import useEffect from 'use-deep-compare-effect'
import BibleReference, { useBibleReference } from 'bible-reference-rcl'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'

function BibleReferenceComponent(props) {
  const [enabled, setEnabled] = useState(false)
  const {
    state: {
      bibleReference: {
        bookId, chapter, verse,
      },
      supportedBibles,
    },
    actions: { onReferenceChange, checkUnsavedChanges },
  } = useContext(StoreContext)

  const { state: {books} } = useContext(AppContext)

  const { state, actions } = useBibleReference({
    initialBook: bookId,
    initialChapter: chapter,
    initialVerse: verse,
    onChange: onReferenceChange,
    onPreChange: () => checkUnsavedChanges(),
  })

  useEffect(() => {
    if ((state.bookId !== bookId) || (state.chapter !== chapter) || (state.verse !== verse)) {
      // update reference if external change (such as user log in causing saved reference to be loaded)
      actions.goToBookChapterVerse(bookId, chapter, verse)
    }
  }, [actions, bookId, chapter, state.bookId, state.chapter, state.verse, verse])

  useEffect(() => {
    // update reference if all books are closed
    const _enabled = (books?.length>0)
    if (enabled !== _enabled) {
      console.log("update books found")
      console.log(_enabled)
      setEnabled(_enabled)
    }
  }, [books, enabled])

  useEffect(() => {
    if (supportedBibles?.length) {
      actions.applyBooksFilter(supportedBibles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportedBibles])

  return (!enabled) ?  <div/> : <BibleReference
      status={state}
      actions={actions}
      style={{ color: '#ffffff' }}
    />

}

export default BibleReferenceComponent
