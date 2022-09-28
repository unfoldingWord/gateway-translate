import React, { useCallback, useMemo, useContext } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  ViewStream,
  Subject,
  Edit,
  Preview,
  Undo,
  Redo
} from "@mui/icons-material";

import { EditorContext } from '@context/EditorContext'

export default function Buttons() {

  const { state, state: {canUndo, canRedo}, actions: {setToggles, undo, redo} } = useContext(EditorContext)
  const togglesAll = useMemo(
    () => ["sectionable", "blockable", "editable", "preview"],
    []
  );
  const toggles = togglesAll.filter((toggle) => state[toggle]);

  const handleToggles = useCallback(
    (event, newToggles) => {
      const _toggles = {};

      togglesAll.forEach((toggle) => {
        _toggles[toggle] = newToggles.includes(toggle);
      });

      setToggles(_toggles);
    },
    [setToggles, togglesAll]
  );

  const handleUndo = (event) => {
    undo();
    event.preventDefault();
    return false;
  };

  const handleRedo = (event) => {
    redo();
    event.preventDefault();
    return false;
  };

  return (
    <ToggleButtonGroup
      data-test-id="ToggleButtonGroup"
      value={toggles}
      onChange={handleToggles}
      aria-label="text formatting"
      className="buttons"
    >
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="ToggleButtonSectionable"
        value="sectionable"
        aria-label="sectionable"
      >
        <ViewStream />
      </ToggleButton>
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="ToggleButtonBlockable"
        value="blockable"
        aria-label="blockable"
      >
        <Subject />
      </ToggleButton>
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="ToggleButtonEditable"
        value="editable"
        aria-label="editable"
      >
        <Edit />
      </ToggleButton>
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="ToggleButtonPreview"
        value="preview"
        aria-label="preview"
      >
        <Preview />
      </ToggleButton>
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="Undo"
        value="undo"
        aria-label="undo"
        onClick={handleUndo}
        disabled={!canUndo}
      >
        <Undo />
      </ToggleButton>
      <ToggleButton
        style={{ color: "white" }}
        data-test-id="Redo"
        value="redo"
        aria-label="redo"
        onClick={handleRedo}
        disabled={!canRedo}
      >
        <Redo />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
