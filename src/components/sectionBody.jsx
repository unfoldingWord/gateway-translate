import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { AccordionDetails } from '@mui/material';
import useLifecycleLog from '../hooks/useLifecycleLog';

export default function SectionBody({ children, show, ...props }) {
  useLifecycleLog(SectionBody);
  
  const component = useDeepCompareMemo(() => {
    let _component = <></>;
    if (show) {
      _component = (
        <AccordionDetails className="sectionBody" {...props}>
          {children}
        </AccordionDetails>
      );
    };
    return _component;
  }, [show, props, children]);

  return component;
};