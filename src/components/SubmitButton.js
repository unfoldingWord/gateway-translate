import Button from '@mui/material/Button'

const sx = {
  root: (props) => ({
    'color': '#ffffff',
    'backgroundColor': props.active ? '#1BCC25' : 'transparent',
    '&:hover': {
      color: theme => (props.active ? '#ffffff' : theme.palette.primary.main),
      backgroundColor: props.active ? '#07b811' : '#ffffff',
    },
    'border': '1px solid #0089C7',
  }),
}

function SubmitButton({ active, ...rest }) {
  return (
    <Button sx={sx.root({active})} {...rest}>
      Submit
    </Button>
  )
}

export default SubmitButton
