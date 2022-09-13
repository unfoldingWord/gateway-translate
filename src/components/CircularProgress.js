import CircularProgressUI from '@material-ui/core/CircularProgress'

function CircularProgress({ size }) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-12'>
      <CircularProgressUI size={size} />
    </div>
  )
}

export default CircularProgress
