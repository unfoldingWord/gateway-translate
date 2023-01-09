import { useRouter } from 'next/router'

import useAuthContext from '@hooks/useAuthContext'
import FeedbackCard from '@components/FeedbackCard'
import Paper from '@mui/material/Paper'
import SetUpWrapper from '@components/SetUpWrapper'

const SendFeedback = () => {
  const {
    state: { authentication },
  } = useAuthContext()
  const router = useRouter()
  const HELP_DESK_EMAIL = process.env.HELP_DESK_EMAIL
  
  console.log("process.env help desk email", HELP_DESK_EMAIL)
  return (
    <SetUpWrapper>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <div className='flex flex-col justify-center items-center'>
          <FeedbackCard
            authentication={authentication}
            onSubmit={() => router.push('/')}
          />
        </div>
      </Paper>
    </SetUpWrapper>
  )
}

export default SendFeedback
