import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

export default function Footer({
  buildVersion,
  buildHash,
  serverID,
}) {
  return (
    <footer className='flex justify-between items-center h-20 w-screen bg-primary border border-solid border-gray-200'>
      <Typography variant='h6'>
        <div className='text-white w-max pl-5'>
          <span id='build_version'>{`v${buildVersion} `}</span>
          <span id='build_hash' style={{ fontSize: '0.6em' }}>{`build ${buildHash}`}</span>
          <span id='server'>{` ${serverID}`}</span>
        </div>
      </Typography>
      <div className='w-40'></div>
    </footer>
  )
}

Footer.propTypes = {
  buildVersion: PropTypes.string,
  buildHash: PropTypes.string,
  serverID: PropTypes.string,
}
