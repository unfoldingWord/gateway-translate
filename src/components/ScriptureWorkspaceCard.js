import React from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import Editor from "./Editor";

export default function ScriptureWorkspaceCard({
  id,
  bookId,
  data,
  classes,
  onClose: removeBook,
}) {

  return (
    <Card title={`${BIBLE_AND_OBS[bookId]} (${id.split('-')[1]})`} 
      classes={classes} 
      hideMarkdownToggle={true} 
      closeable={true}
      onClose={() => removeBook(id)}
      key={bookId}
    >
      <Editor data={data}/>
    </Card>
  )
}

ScriptureWorkspaceCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

