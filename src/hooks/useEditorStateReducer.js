import { useState, useCallback } from "react";
import PropTypes from 'prop-types';

export default function useEditorStateReducer({ ...props }) {
  const initialState = {
    title: "Gateway Translation",
    sequenceIds: [],
    sectionable: true,
    blockable: true,
    editable: true,
    preview: false,
    verbose: false,
    bcvQuery: {},
    pkDocuments: [],
    ...props
  };

  const [state, setState] = useState(initialState);

  const setSectionable = useCallback((sectionable) => {
    setState((prev) => ({ ...prev, sectionable }));
  }, []);

  const setBlockable = useCallback((blockable) => {
    setState((prev) => ({ ...prev, blockable }));
  }, []);

  const setEditable = useCallback((editable) => {
    setState((prev) => ({ ...prev, editable }));
  }, []);

  const setPreview = useCallback((preview) => {
    setState((prev) => ({ ...prev, preview }));
  }, []);

  const setToggles = useCallback((toggles) => {
    setState((prev) => ({ ...prev, ...toggles }));
  }, []);

  const setSequenceIds = useCallback((sequenceIds) => {
    setState((prev) => ({ ...prev, sequenceIds }));
  }, []);

  const addSequenceId = useCallback(
    (_sequenceId) => {
      setSequenceIds([...state.sequenceIds, _sequenceId]);
    },
    [state.sequenceIds, setSequenceIds]
  );

  const setBcvQuery = useCallback((bcvQuery) => {
    setState((prev) => ({ ...prev, bcvQuery }));
  }, []);

  const setPkDocuments = useCallback((pkDocuments) => {
    setState((prev) => ({ ...prev, pkDocuments }));
  }, []);

  const addPkDocument = useCallback(
    (_pkDocument) => {
      setPkDocuments([...state.pkDocuments, _pkDocument]);
    },
    [state.pkDocuments, setPkDocuments]
  );

  const actions = {
    setSectionable,
    setBlockable,
    setEditable,
    setPreview,
    setToggles,
    setSequenceIds,
    addSequenceId,
    setBcvQuery,
    setPkDocuments,
    addPkDocument,
  };

  return { state, actions };
};

useEditorStateReducer.propTypes = {
  sequenceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  sectionable: PropTypes.bool,
  blockable: PropTypes.bool,
  editable: PropTypes.bool,
  preview: PropTypes.bool,
  verbose: PropTypes.bool,
};
