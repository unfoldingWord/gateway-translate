import { useEffect, useContext, useState } from "react";
import usePerf from "./usePerf";
import { AppContext } from '@context/AppContext'
import { useImport, useCatalog } from "proskomma-react-hooks";

export default function usePkBcvQuery({ server, selectors, filename, ready: paramReady, bookId, bcvQuery}) {
  const [ready,setReady] = useState(false)
  const docSetId = `${selectors?.org}/${selectors?.lang}_${selectors?.abbr}`

  const {
    state: {
      pkHook,
      pkCatalog,
    },
    actions: { setPkCatalog, },
  } = useContext(AppContext)

  console.log(pkCatalog)
  console.log(bookId)

  useEffect(() => {
    console.log('check and update Proskomma')
    if (paramReady){
      const pkDocuments = [
        { 
          selectors,
          bookCode: bookId,
          chapter: 1,
          url: `${server}/${selectors?.org}/${selectors?.lang}_${selectors?.abbr}/raw/branch/master/${filename}`
        },
      ];
  
      console.log(pkDocuments)
/* Do the import here - without hook!!! 
      const { done } = useImport({ proskomma, stateId, newStateId, documents: pkDocuments });
Update the catalogue here - also without hook !!!      
      const { catalog } = useCatalog({ proskomma, stateId, verbose });
*/      
    }
  }, [bookId, filename, pkHook, selectors, server, paramReady] )

  const { proskomma, stateId, newStateId } = pkHook;

  const { state: perfState, actions: perfActions } = usePerf({
    proskomma, ready: paramReady, docSetId, bookCode: bookId.toUpperCase(), verbose: true, bcvQuery
  });

  const { htmlPerf } = perfState;
  /*
  const titusUltUsfm = "**SOME ULT USFM STRING**";
  const titusUstUsfm = "**SOME UST USFM STRING**";

  pk.importDocument(
    { org: "dcs", lang: "en", abbr: "ult" },
    "usfm",
    titusUltUsfm
  );
  
  pk.importDocument(
    { org: "dcs", lang: "en", abbr: "ust" },
    "usfm",
    titusUstUsfm
  );
  
  //Setting epitelete
  const epiUlt = new Epitelete({
    pk,
    docSetId: "dcs/en_ult",
    options: { historySize: 10 },
  });
  
  const epiUst = new Epitelete({
    pk,
    docSetId: "dcs/en_ust",
    options: { historySize: 10 },
  });
  
  const titPerfUlt = await epiUlt.readPerf("TIT");
  const titPerfUst = await epiUst.readPerf("TIT");


    if (pkDocuments && pkDocuments[0] && pkDocuments[0].bookCode && pkDocuments[0].chapter) {
  console.log(pkDocuments[0].chapter)
      bcvQuery = { 
        book: { 
          [pkDocuments[0].bookCode.toLowerCase()]: {
             ch: { 
              [pkDocuments[0].chapter] : {} 
            } 
          } 
        } 
      }
    }
  console.log(bcvQuery)
  */
  
  const state = {
    htmlPerf,
  };

  return htmlPerf;
}
