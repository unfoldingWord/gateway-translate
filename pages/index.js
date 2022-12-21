import Head from 'next/head'
// import Link from 'next/link'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'
import styles from '../src/styles/Home.module.css'
import { Box } from '@mui/material'

// import ScriptureWorkspace from '@components/ScriptureWorkspace'
const ScriptureWorkspace = dynamic(
  () => import('@components/ScriptureWorkspace'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  }
)

function Home() {
  return (
    <Box
      sx={{
        p: '0 2rem',
        display: 'flex',
        flexGrow: 1,
        boxSizing: 'border-box',
      }}
    >
      <Head>
        <title>gatewayTranslate</title>
        <meta name='description' content='gatewayTranslate' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ScriptureWorkspace />
    </Box>
  )
}

export default Home
