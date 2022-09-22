import React, { useEffect } from 'react';
import { Accordion } from '@mui/material';
import useLifecycleLog from '../hooks/useLifecycleLog';

export default function Section({ children, index, show, dir, verbose, ...props }) {
  useLifecycleLog(Section, index);

  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      expanded={show}
      className={"section " + dir}
      dir={dir}
      {...props}
    >
      {children}
    </Accordion>
  );
};