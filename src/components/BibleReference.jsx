import React, { useContext } from 'react'
import useEffect from 'use-deep-compare-effect'
import BibleReference, { useBibleReference } from 'bible-reference-rcl'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'

function BibleReferenceComponent(props) {
  const {
    state: {
      bibleReference: {
        bookId, chapter, verse,
      },
      supportedBibles,
    },
    actions: { onReferenceChange, checkUnsavedChanges },
  } = useContext(StoreContext)

  const { state: {hasOpenBook} } = useContext(AppContext)

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
    if (supportedBibles?.length) {
      actions.applyBooksFilter(supportedBibles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportedBibles])

  return (!hasOpenBook) ?  <div/> : <BibleReference
      status={state}
      actions={actions}
      style={{ color: '#ffffff' }}
    />

}

export default BibleReferenceComponent
