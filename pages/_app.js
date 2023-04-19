import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// NOTE: If I change the import below to go to @mui
// the colors on the header are lost!?
// TBD: chase this down
// import { ThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from '@mui/material/styles'

import CssBaseline from '@mui/material/CssBaseline'
import StoreContextProvider from '@context/StoreContext'
import AuthContextProvider from '@context/AuthContext'
import AppContextProvider from '@context/AppContext'
import {PkCacheProvider} from '@oce-editor-tools/pk'
import { APP_NAME } from '@common/constants'
import AppHead from '@components/AppHead'
import Layout from '@components/Layout'
import theme from '../src/theme'
import '@styles/globals.css'
import NonSSRWrapper from '@components/NonSSRWrapper'


export default function Application({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const [firstTime, setFirstTime] = useState(true)
  useEffect( () => {
    if ( firstTime ) {
      // hopefully this only runs one time...
      sessionStorage.setItem("unsavedChanges", 0)
      setFirstTime(false)
    }
  }, [firstTime])

  // prompt the user if they try and leave with unsaved changes  
  useEffect(() => {
    const warningText =
      'You have unsaved changes - are you sure you wish to leave this page?';
    const handleWindowClose = (e) => {    
      let unsavedChanges = false
      let _unsavedChanges = sessionStorage.getItem("unsavedChanges")
      console.log("_unsavedChanges type,value",typeof _unsavedChanges, _unsavedChanges)
      if ( _unsavedChanges === "" || _unsavedChanges === null || _unsavedChanges === "0" ) { 
        return
      }
      // if (!_unsavedChanges) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    // const handleBrowseAway = () => {
    //   if (!unsavedChanges) return;
    //   if (window.confirm(warningText)) return;
    //   router.events.emit('routeChangeError');
    //   throw 'routeChange aborted.';
    // };
    window.addEventListener('beforeunload', handleWindowClose);
    // router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      // router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, []);

  return (
    <div>
      <NonSSRWrapper>
      <ThemeProvider theme={theme}>
      <AppHead title={APP_NAME} />
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AuthContextProvider>
          <StoreContextProvider>
              <PkCacheProvider>
                <AppContextProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  </AppContextProvider>
              </PkCacheProvider>
          </StoreContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
      </NonSSRWrapper>
    </div>
  )
}

Application.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  pageProps: PropTypes.object,
}
