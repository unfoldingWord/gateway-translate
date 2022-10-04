import { useContext, useState } from "react";
import { useRepoClient } from 'dcs-react-hooks';
import { useCatalog } from "proskomma-react-hooks";
import { AppContext } from '@context/AppContext'
import { usfmFilename } from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';
import useDeepEffect from 'use-deep-compare-effect';

export default function usePkResourceCache( queryStr ) {
  const [usfmCache,setUsfmCache] = useState({})
  const [done,setDone] = useState(false)

  const {
    state: {
      pkHook,
    },
  } = useContext(AppContext)

  const { proskomma, stateId } = pkHook;

  const { catalog } = useCatalog({ proskomma, stateId, verbose: true });

  const pkCache = {}
  catalog && catalog?.docSets && catalog.docSets.forEach((docSet) => {
    console.log(docSet)
    const _id = docSet.id
    const _bookCode = docSet.documents && docSet.documents[0] && docSet.documents[0].bookCode
    const extBcvKey = `${_id}/${_bookCode}`
    pkCache[extBcvKey] = docSet.documents[0]
  })

  const repoClient = useRepoClient({ basePath: "https://git.door43.org/api/v1/" })

  // monitor the usfmCache and import if a new queryStr is found
  useDeepEffect(() => {
    const addUsfmCache = (key, str) => {
      setUsfmCache({ [key]: str, ...usfmCache });
    }
    async function getUsfm() {
      const [owner, repoStr, bookId] = queryStr?.split('/')
      const filename = usfmFilename(bookId)
      const _content = await repoClient.repoGetContents(
        owner,repoStr,filename
      ).then(({ data }) => data)
      // note that "content" is the JSON returned from DCS. 
      // the actual content is base64 encoded member element "content"
      let _usfmText;
      if (_content && _content.encoding && _content.content) {
        if ('base64' === _content.encoding) {
          _usfmText = decodeBase64ToUtf8(_content.content)
        } else {
          _usfmText = _content.content
        }
        addUsfmCache(queryStr,_usfmText)
      }
    }
    if (!usfmCache[queryStr]) getUsfm()
  }, [queryStr,usfmCache,setUsfmCache])

  // monitor the pkCache and import needed documents from usfmCache
  useDeepEffect(() => {
    async function doImportPk() {
      const [org, repoStr, bookId] = queryStr?.split('/')
      const [lang, abbr] = repoStr?.split('_')
      proskomma.importDocument(
        { org, lang, abbr },
        "usfm",
        usfmCache[queryStr]
      )
      setDone(true)
    }

    if (usfmCache[queryStr]) {
      if (proskomma && !pkCache[queryStr]) {
        doImportPk()
      } else {
        setDone(true)
      }
    }
  }, [queryStr,usfmCache,pkCache,proskomma])

  return done;
}
