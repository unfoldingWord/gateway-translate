import { useProskomma, useImport, useCatalog } from "proskomma-react-hooks";
import { useDeepCompareEffect } from "use-deep-compare";

//import perf from "../data/TIT-eBible-fra_fraLSG-undefinedperfhtml_v0.2.1.json";

import usePerf from "./usePerf";
import useEditorStateReducer from './useEditorStateReducer';

const _documents = [
  // { 
  //  selectors: { org: 'bcs', lang: 'hi', abbr: 'irv' },
  //  bookCode: 'tit',
  //  url: '/bcs-hi_irv.tit.usfm',
  // },
  { 
    selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ult' },
    bookCode: 'tit',
    url: 'https://git.door43.org/unfoldingWord/en_ust/raw/branch/master/57-TIT.usfm',
  },
];

export default function useEditorState(props) {
  const { state, actions } = useEditorStateReducer(props);
  const { verbose } = state;

  const { proskomma, stateId, newStateId } = useProskomma({ verbose });
  const { done } = useImport({ proskomma, stateId, newStateId, documents: _documents });

  const { catalog } = useCatalog({ proskomma, stateId, verbose });

  const { id: docSetId, documents } = done && catalog.docSets[0] || {};
  const { bookCode } = documents && documents[0] || {};
  const ready = docSetId && bookCode || false;
  const isLoading = !done || !ready;

  const { state: perfState, actions: perfActions } = usePerf({
    proskomma, ready, docSetId, bookCode, verbose
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
