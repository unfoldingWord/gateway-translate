import { useContext, useState } from "react";
import usePerf from "./usePerf";
import usePkResourceCache from './usePkResourceCache';
import { AppContext } from '@context/AppContext'
import { StoreContext } from '@context/StoreContext'
import { LITERAL } from '@common/constants';

export default function usePkQuery({ ready: paramReady, type, bookId, chapter}) {

  const {
    state: {
      pkHook,
    },
  } = useContext(AppContext)

  const { proskomma } = pkHook;

  const {
    state: {
      owner,
      languageId,
    },
  } = useContext(StoreContext)

  const abbr = 
    ( owner.toLowerCase() === 'unfoldingword' ) 
      ? ( type === LITERAL ) 
        ? 'ult' : 'ust'
      : ( type === LITERAL ) 
        ? 'glt' : 'gst'

  const docSetId = `${owner}/${languageId}_${abbr}`
  const extBcvQuery = `${owner}/${languageId}_${abbr}/${bookId}`
  const verbose = true
  const cacheReady = usePkResourceCache(extBcvQuery)
  const allAreReady = paramReady && cacheReady

  const bcvQuery = { 
    book: { 
      [bookId?.toLowerCase()]: {
         ch: { [chapter] : {} } 
      } 
    } 
  }

  const { state: perfState, actions: perfActions } = usePerf({
    proskomma, ready: allAreReady, docSetId, bookCode: bookId.toUpperCase(), verbose, bcvQuery
  });

  const { htmlPerf } = perfState;
 
  return htmlPerf;
}
