export default ({
  "*": {
    "*": {
      "tagName": "span"
    },
    "sequence":{
      "tagName": "section"
    }
  },
  "paragraph": {
    "*": {
      "tagName": "p"
    }
  },
  "mark": {
    "*": {
      "tagName": "span"
    },
    "chapter": ({ atts }) => ({
      classList: ['mark', 'chapter', `chapter-${atts.number}`],
      id: `chapter-${atts.number}`,
    })
  },
  "graft":{
    "heading": {
      "tagName": "div"
    },
    "title": {
      "tagName": "div"
    },
    "introduction": {
      "tagName": "div"
    }
  }
})