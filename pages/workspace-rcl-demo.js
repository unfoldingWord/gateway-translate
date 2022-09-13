import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'

const WorkspaceContainer = dynamic(
  () => import('@components/WorkspaceContainer'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

const Home = () => (
  <div>
    <WorkspaceContainer />
  </div>
)

export default Home
