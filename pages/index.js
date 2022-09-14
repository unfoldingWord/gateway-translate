import Head from 'next/head'
import styles from '../src/styles/Home.module.css'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'
// import Layout from '@components/Layout'
import BookSelector from '@components/BookSelector'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>gatewayTranslate</title>
        <meta name="description" content="gatewayTranslate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BookSelector />
    </div>
  )
}
