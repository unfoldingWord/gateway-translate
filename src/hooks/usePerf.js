import { useState, useTransition } from "react";
import { useDeepCompareCallback, useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import isEqual from 'lodash.isequal';
import EpiteletePerfHtml from "epitelete-perf-html";

export default function usePerf({ proskomma, ready, docSetId, bookCode, verbose }) {
  const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();

  
  const epiteletePerfHtml = useDeepCompareMemo(() => (
    ready && new EpiteletePerfHtml({ proskomma, docSetId, options: { historySize: 100 } })
    ), [proskomma, ready, docSetId]);
    
    useDeepCompareEffect(() => {
      if (epiteletePerfHtml) {
        epiteletePerfHtml.readHtml(bookCode).then((_htmlPerf) => {
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteletePerfHtml, bookCode]);

  const saveHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId, htmlSequence }) => {
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);
    
    startSaving(async () => {
      const newHtmlPerf = await epiteletePerfHtml?.writeHtml( bookCode, sequenceId, _htmlPerf );
      if (verbose) console.log({ info: "Saved sequenceId", bookCode, sequenceId });
  
      const perfChanged = !isEqual(htmlPerf, newHtmlPerf);
      if (perfChanged) setHtmlPerf(newHtmlPerf);
    });
  }, [htmlPerf, bookCode]);

  const undo = async () => {
    const newPerfHtml = await epiteletePerfHtml?.undoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const redo = async () => {
    const newPerfHtml = await epiteletePerfHtml?.redoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const canUndo = epiteletePerfHtml?.canUndo && epiteletePerfHtml?.canUndo(bookCode) || false;
  const canRedo = epiteletePerfHtml?.canRedo && epiteletePerfHtml?.canRedo(bookCode) || false;

  const state = {
    bookCode,
    htmlPerf,
    canUndo,
    canRedo,
    isSaving,
  };

  const actions = {
    saveHtmlPerf,
    undo,
    redo
  };

  return { state, actions };
}
