import Head from 'next/head'
// import Link from 'next/link'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'

import styles from '../src/styles/Home.module.css'
// import ScriptureWorkspace from '@components/ScriptureWorkspace'
const ScriptureWorkspace = dynamic(
  () => import('@components/ScriptureWorkspace'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

export default function Home() {
  return (
      <div className={styles.container}>
        <Head>
          <title>gatewayTranslate</title>
          <meta name="description" content="gatewayTranslate" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ScriptureWorkspace />
      </div>
  )
}
