import Head from 'next/head'
import Link from 'next/link'
import styles from '../src/styles/Home.module.css'
import ScriptureWorkspace from '@components/ScriptureWorkspace'

export default function Home() {
  return (
      <div className={styles.container}>
        <Head>
          <title>gatewayAdmin</title>
          <meta name="description" content="gatewayAdmin" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ScriptureWorkspace />
      </div>
  )
}
