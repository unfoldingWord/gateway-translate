import { useContext } from 'react'
import { useProskomma, useImport, useCatalog } from "proskomma-react-hooks";
import { useDeepCompareEffect } from "use-deep-compare";
import { AppContext } from '@context/AppContext'

import usePerf from "./usePerf";
import useEditorStateReducer from './useEditorStateReducer';

const pkDocuments2 = [
  { 
    selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ust' },
    bookCode: 'tit',
    chapter: 1,
    url: 'https://git.door43.org/unfoldingWord/en_ust/raw/branch/master/57-TIT.usfm',
  },
];

export default function useEditorState(props) {
  const { state, actions } = useEditorStateReducer(props);
  const { verbose, pkDocuments } = state;

  console.log(pkDocuments2)
  console.log(pkDocuments)

  const { proskomma, stateId, newStateId } = useProskomma({ verbose });
  const { done } = useImport({ proskomma, stateId, newStateId, documents: pkDocuments2 });

  const { catalog } = useCatalog({ proskomma, stateId, verbose });
console.log(catalog)
  const { id: docSetId, documents } = done && catalog.docSets[0] || {};
  const { bookCode } = documents && documents[0] || {};
  const ready = docSetId && bookCode || false;
  const isLoading = !done || !ready;

  let bcvQuery = {}
  if (bookCode && pkDocuments && pkDocuments[0] && pkDocuments[0].chapter) {
console.log(pkDocuments[0].chapter)
    bcvQuery = { 
      book: { 
        [bookCode.toLowerCase()]: {
           ch: { 
            [pkDocuments[0].chapter] : {} 
          } 
        } 
      } 
    }
  }
console.log(bcvQuery)
  const { state: perfState, actions: perfActions } = usePerf({
    proskomma, ready, docSetId, bookCode, verbose, bcvQuery
  });
  const { htmlPerf } = perfState;


  useDeepCompareEffect(() => {
    if (htmlPerf && htmlPerf.mainSequenceId !== state.sequenceIds[0]) {
      actions.setSequenceIds([htmlPerf?.mainSequenceId]);
    };
  }, [htmlPerf, state.sequenceIds]);

  return {
    state: {...state, ...perfState, isLoading },
    actions: {...actions, ...perfActions },
  };

};
