import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import CircularProgress from '@components/CircularProgress'

const AccountSetup = dynamic(
  () => import('@components/forms/AccountSetupForm'),
  {
    loading: () => <CircularProgress size={180} />,
  }
)

function Onboarding({ authentication, authenticationComponent }) {
  if (authentication) {
    return <AccountSetup authentication={authentication} />
  }

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <Paper className='flex justify-center items-center h-104 w-104 bg-white p-10 sm:h-116 sm:w-116'>
        {authenticationComponent}
      </Paper>
    </div>
  )
}

Onboarding.propTypes = {
  authentication: PropTypes.object,
  authenticationComponent: PropTypes.node.isRequired,
}

export default Onboarding
