import useAuthContext from '@hooks/useAuthContext'
import FeedbackCard from '@components/FeedbackCard'
import Paper from '@mui/material/Paper'
import SetUpWrapper from '@components/SetUpWrapper'
import { useRouter } from 'next/router'

const SendFeedback = () => {
  const {
    state: { authentication },
  } = useAuthContext()
  const router = useRouter()

  return (
    <SetUpWrapper>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <div className='flex flex-col justify-center items-center'>
          <FeedbackCard
            authentication={authentication}
            onClose={ () => router.push('/') }
            initCard={true}
          />
        </div>
      </Paper>
    </SetUpWrapper>
  )
}

export default SendFeedback
