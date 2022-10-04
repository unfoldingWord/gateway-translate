import { useContext } from "react";
import { Skeleton, Stack } from "@mui/material";

import { AppContext } from '@context/AppContext'
import useLifecycleLog from "../hooks/useLifecycleLog";
import usePkQuery from "../hooks/usePkQuery";

import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./sectionBody";
import { HtmlPerfEditor } from "@xelah/type-perf-html";

export default function Editor(props) {

  const {
    state: {
      isSaving,
      isLoading,
      sectionable,
      blockable,
      editable,
      preview,
      verbose,
    },
    actions: { addSequenceId, saveHtmlPerf, },
  } = useContext(AppContext)

  const { data } = props

  const ready = Boolean( (data?.bookId && data?.bookId) || false )

  const htmlPerf = usePkQuery({ 
    ready, 
    type: data?.type, 
    bookId: data?.bookId, 
    chapter: 1,
  })

  const sequenceIds = [htmlPerf?.mainSequenceId]
  const sequenceId = sequenceIds?.at(-1);

  useLifecycleLog(Editor);
  const style = (isSaving || isLoading || !sequenceId) ? { cursor: 'progress' } : {};

  const skeleton = (
    <Stack spacing={1}>
      <Skeleton key='1' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='2' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='3' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='4' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
    </Stack>
  );

  const htmlEditorProps = {
    htmlPerf,
    onHtmlPerf: saveHtmlPerf,
    sequenceIds,
    addSequenceId,
    components: {
      section: Section,
      sectionHeading: SectionHeading,
      sectionBody: SectionBody,
    },
    options: {
      sectionable,
      blockable,
      editable,
      preview
    },
    // handlers: {
    //   onSectionClick,
    //   onBlockClick
    // },
    decorators: {},
    verbose,
  };

  return (
    <div className="Editor" style={style}>
      {sequenceId ? <HtmlPerfEditor {...htmlEditorProps} /> : skeleton}
    </div>
  );
};
