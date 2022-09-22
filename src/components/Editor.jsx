import { useContext } from "react";
import { Skeleton, Stack } from "@mui/material";

import { EditorContext } from "../context/EditorContext";
import useLifecycleLog from "../hooks/useLifecycleLog";

import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./sectionBody";
import { HtmlPerfEditor } from "@xelah/type-perf-html";

export default function Editor() {
  const {
    state: {
      sequenceIds,
      isSaving,
      isLoading,
      htmlPerf,
      sectionable,
      blockable,
      editable,
      preview,
      verbose,
    },
    actions: { addSequenceId, saveHtmlPerf },
  } = useContext(EditorContext);

  const sequenceId = sequenceIds.at(-1);

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

  const props = {
    htmlPerf: htmlPerf,
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
      {sequenceId ? <HtmlPerfEditor {...props} /> : skeleton}
    </div>
  );
};
