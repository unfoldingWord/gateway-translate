import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import StoreContextProvider from '@context/StoreContext'
import AuthContextProvider from '@context/AuthContext'
import AppContextProvider from '@context/AppContext'
import PkCacheProvider from 'uw-editor'
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

  return (
    <div>
      <NonSSRWrapper>
      <AppHead title={APP_NAME} />
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AuthContextProvider>
          <StoreContextProvider>
              <AppContextProvider>
                <PkCacheProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </PkCacheProvider>
              </AppContextProvider>
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
