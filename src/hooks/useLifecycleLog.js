import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function useLifecycleLog (component, key='') {
  const { state: { verbose } } = useContext(AppContext);
  const name = component.displayName || component.name;

  useEffect(() => {
    if (verbose) console.log(`${name}(${key}): Mount/First Render`);
    return (() => {
      if (verbose) console.log(`${name}(${key}): Unmount/Destroy`);
    });
  }, [key, name, verbose]);
};