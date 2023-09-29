import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { TOKEN_ID } from '@common/constants'
import Typography from '@mui/material/Typography'

const SettingsForm = ({
  children,
  isLoading,
  error,
  label,
  errorMessage,
  icon: Icon,
  sx,
  ...props
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        ...sx,
        p: '1rem',
        my: '1rem',
      }}
      {...props}
    >
      <Box
        sx={{
          [`& .${TOKEN_ID}-MuiTextField-root`]: { my: 10 },
          textAlign: 'center',
        }}
        noValidate
        autoComplete='off'
      >
        <FormControl fullWidth={true}>
          <FormLabel sx={{ mb: '1rem' }}>
            {Icon ? <Icon sx={{ fontSize: 60 }}></Icon> : null}
            <Typography>{label}</Typography>
          </FormLabel>
          {children}
          {error && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormControl>
      </Box>
    </Paper>
  )
}

export default SettingsForm
