import React from 'react';
import useEditorState from '../hooks/useEditorState';

export const EditorContext = React.createContext({});

export default function EditorContextProvider({ children, ...props }) {
  const {
    state,
    actions,
  } = useEditorState({...props});

  const value = {
    state,
    actions,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
