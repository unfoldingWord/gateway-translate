import {createTheme} from '@mui/material/styles'
import {red} from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#38ADDF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#19857b',
      contrastText: '#000',
    },
    error: { main: red.A400 },
    background: { default: '#fff' },
    green: '#1BCC25',
  },
})

export default theme
