import Typography from '@mui/material/Typography'

function EmptyMessage({ message, actionComponent: Action, ...props }) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-12'>
      <Typography {...props}>
        {message} {Action ? <Action /> : null}{' '}
      </Typography>
    </div>
  )
}

export default EmptyMessage
