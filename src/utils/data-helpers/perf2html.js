import defaultHtmlMap from "./htmlmap.js";
import {
  createElement,
  handleAtts,
  handleSubtypeNS,
  mapHtml
} from "./helpers";

function perf2html(perfDocument, sequenceId, htmlMap = defaultHtmlMap, bcvFilter) {
  const bcvContext = {
    bookId: perfDocument?.metadata?.document?.bookCode,
    ignoreAll: false,
  }

  const verifyBcv = () => { // set ignoreAll accordingly - implemented as a local side-effect!
    const bkListObj = bcvFilter?.book
    let invalidBcv = false
    if (bkListObj) { // found list of books
      const bk = bcvContext?.bookId.toLowerCase()
      const bkObj = bk && bkListObj[bk]
      if (!bkObj) { // current book is not found
        invalidBcv = true
      } else { 
        const chListObj = bkObj.ch
        if (chListObj) { // found list of chapters
          const chNum = bcvContext?.chNum
          const chObj = chNum && chListObj[chNum]
          if (!chObj) { // current chapter is not found
            invalidBcv = true
          } else {
            const vListObj = chObj.v
            if (vListObj) { // found list of verses
              const vNum = bcvContext?.vNum
              invalidBcv = !vNum || !vListObj[vNum] // check if current verse is found
            }
          }
        }
      }
    }
    bcvContext.ignoreAll = invalidBcv
  }

  const conditionalCreateElement = (props) => {
    const resStr = createElement ({...props})
    return bcvContext.ignoreAll ? "" : resStr
  }

  const contentChildren = (content) => content?.reduce(
    (contentHtml, element) => {
      return contentHtml += (typeof element === "string")
        ? bcvContext.ignoreAll ? "" : element
        : contentElementHtml(element)
    },
    ""
  ) ?? "";

  const contentHtml = (content, className) =>
    content
      ? conditionalCreateElement({
          tagName: "span",
          classList: [className],
          children: content?.reduce(
            (contentsHtml, element) =>
              typeof element === "string"
                ? bcvContext.ignoreAll ? "" : (contentsHtml += element)
                : (contentsHtml += contentElementHtml(element)),
            ""
          )
        })
      : "";

  const contentElementHtml = (element) => {
    const {
      type,
      subtype,
      content,
      meta_content,
      atts,
      ...props
    } = element;
    const _bookId = bcvContext.bookId
    const bookId = _bookId.charAt(0).toUpperCase() + _bookId.slice(1).toLowerCase()
    const attsProps = 
      (subtype === "verses") 
        ? { "bcv-id": `${bookId}.${bcvContext.chNum}.${atts.number}` } 
        : handleAtts(atts) 
    const subtypes = handleSubtypeNS(subtype);
    const { classList, tagName, id } = mapHtml({ props:{ type, subtype, atts, ...props }, htmlMap });
    const innerHtml = (content) => {
      const getters = {
        markHtml: () => ["chapter", "verses"].includes(subtype) ? atts.number : "",
        wrapperHtml: () => contentChildren(content) + contentHtml(meta_content, "meta-content")
      };
      const getContentHtml = getters[`${type}Html`];
      if (type === "mark") {
        if (subtype === "chapter") {
          bcvContext.chNum = atts.number
          bcvContext.vNum = 1
          verifyBcv()
        } else if (subtype === "verses") {
          bcvContext.vNum = atts.number
          verifyBcv()
        }
      }
      const retStr = typeof getContentHtml === "function" ? getContentHtml() : ""
      return bcvContext.ignoreAll ? "" : retStr
    };

    return conditionalCreateElement({
      tagName,
      id,
      classList,
      dataset: { type, ...subtypes, ...attsProps, ...props},
      children: innerHtml(content)
    });
  };

  const blockHtml = (block) => {
    const { type, subtype, atts, content, ...props } = block;
    const attsProps = handleAtts(atts);
    const subtypes = handleSubtypeNS(subtype);
    const { classList, tagName, id } = mapHtml({ props:{ type, subtype, atts, ...props }, htmlMap });
    return conditionalCreateElement({
      tagName,
      id,
      classList,
      dataset: { type, ...subtypes, ...attsProps, ...props },
      children: contentChildren(content)
    });
  };

  const sequenceHtml = (perfSequence, sequenceId) => {
    const { blocks, ...props } = perfSequence;
    const { classList, tagName } = mapHtml({ props: {...props, subtype: "sequence"}, htmlMap });
    return createElement({
      tagName,
      id: `${sequenceId}`,
      classList: classList,
      dataset: props,
      children: blocks?.reduce(
        (blocksHtml, block) => (blocksHtml += blockHtml(block)),
        ""
      )
    });
  };
  const perfSequence = perfDocument.sequences[sequenceId];
  return sequenceHtml(perfSequence, sequenceId);
}

export default perf2html;
