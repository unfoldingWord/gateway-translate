import useEditorStateReducer from './useEditorStateReducer';

export default function useEditorState(props) {
  const { state, actions } = useEditorStateReducer(props);

/*
  useDeepCompareEffect(() => {
    if (htmlPerf && htmlPerf.mainSequenceId !== state.sequenceIds[0]) {
      actions.setSequenceIds([htmlPerf?.mainSequenceId]);
    };
  }, [htmlPerf, state.sequenceIds]);
*/

  return {
    state: {...state },
    actions: {...actions },
  };

};
