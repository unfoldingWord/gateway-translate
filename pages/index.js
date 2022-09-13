import Head from 'next/head'
import Link from 'next/link'
import styles from '../src/styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>unfoldingWord Nextjs Template App</title>
        <meta name="description" content="unfoldingWord Nextjs template app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js</a> Template App at <a href="https://unfoldingword.org">uW</a>!
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <Link href='/documentation'>
            <a className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about this Next.js template app.</p>
            </a>
          </Link>

          <Link href='/workspace-rcl-demo'>
            <a className={styles.card}>
              <h2>Resource Workspace RCL &rarr;</h2>
              <p>Check out the Resource Workspace RCL live!</p>
            </a>
          </Link>

          <Link href='/example'>
            <a className={styles.card}>
              <h2>Example &rarr;</h2>
              <p>Example description.</p>
            </a>
          </Link>

          <Link href='/workspace-rcl-demo'>
            <a className={styles.card}>
              <h2>Example &rarr;</h2>
              <p>Example description.</p>
            </a>
          </Link>

        </div>
      </main>
    </div>
  )
}
