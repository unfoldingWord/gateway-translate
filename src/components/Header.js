import { useState, useContext } from 'react'
// import TextField from '@mui/material/core/TextField'

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
// import { makeStyles } from '@material-ui/core/styles'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@components/Drawer'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AppContext } from '@context/AppContext'
import FeedbackPopup from '@components/FeedbackPopup'
import SelectBookPopup from './SelectBookPopup'
import { randomLetters } from '@utils/randomLetters'

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1 },
  button: {
    minWidth: '40px',
    padding: '5px 0px',
    marginRight: theme.spacing(3),
  },
  icon: { width: '40px' },
  menuButton: { marginRight: theme.spacing(1) },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default function Header({
  title,
  resetResourceLayout,
  authentication: { user },
  feedback,
  setFeedback,
}) {
  const classes = useStyles()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const [drawerOpen, setOpen] = useState(false)
  const { actions: { logout } } = useContext(AuthContext)
  const { state: { owner, languageId }, actions: { checkUnsavedChanges } } = useContext(StoreContext)
  const { state: { books }, actions: { setBooks, setLtStState } } = useContext(AppContext)
  const handleDrawerOpen = () => {
    if (!drawerOpen) {
      setOpen(true)
    }
  }

  const handleDrawerClose = () => {
    if (drawerOpen) {
      setOpen(false)
    }
  }

  const doShowFeedback = () => {
    setFeedback && setFeedback(true)
  }

  const doHideFeedback = () => {
    setFeedback && setFeedback(false)
  }

  const onNext = ({ value, ltStState, url }) => {
    if ( url && ltStState === 'custom' && books && setBooks ) {
      let _books = [...books]
      let _entry = { id: null, bookId: null, type: null, content: null }
      const found = url.match(/[-_\/](?<bookId>[a-zA-Z_]*)\.usfm$/)
      if ( found ) {
        _entry.bookId = found.groups.bookId
      } else {
        _entry.bookId = url.substr(-10)
      }
      _entry.bookId = _entry.bookId.substr(-3)
      console.log("BookID=", _entry.bookId)
      const _owner = randomLetters(3);
      const _lang  = randomLetters(2);
      _entry.id = `${_entry.bookId}-${ltStState}-${_owner}-${_lang}`
      _entry.type = ltStState
      _entry.url = url
      _books.push(_entry)
      setBooks(_books)
      console.log("onNext() _books:",_books)
      console.log(url)
    } else if ( books && setBooks ) {
      let _books = [...books]
      let _entry = { id: null, bookId: null, type: null, content: null }
      _entry.id = `${value.id}-${ltStState}-${owner}-${languageId}`
      _entry.bookId = value.id
      _entry.type = ltStState
      _books.push(_entry)
      setBooks(_books)
      console.log("onNext() _books:",_books)
      // after a bit update the books and see what happens
      //setTimeout( () => console.log("Header() after setBooks, books:",books), 1 );
    }
    if ( setLtStState ) {
      setLtStState( ltStState )
    }
  }


  return (
    <header>
      <AppBar position='static'>
        <Toolbar>
          <div className='flex flex-1 justify-center items-center'>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              className={classes.title}
              onClick={() => router.push('/')}
            >
              {title}
            </Typography>
          </div>
          <>
            {
              user && owner && (router.pathname === '/') &&
              <Fab color="primary" aria-label="add" variant="extended"
                onClick={() => { setShowModal(true)} }
              >
                <AddIcon className={classes.extendedIcon}  />
                Book
              </Fab>
            }
          </>
          <>
            <SelectBookPopup
              onNext={onNext}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </>
        </Toolbar>
      </AppBar>
      <Drawer
        user={user}
        logout={logout}
        open={drawerOpen}
        onOpen={handleDrawerOpen}
        onClose={handleDrawerClose}
        checkUnsavedChanges={checkUnsavedChanges}
        resetResourceLayout={resetResourceLayout}
        showFeedback={doShowFeedback}
      />
      { feedback ?
        <FeedbackPopup
          open
          {...feedback}
          onClose={doHideFeedback}
        />
        :
        null
      }
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  authentication: PropTypes.object,
  resetResourceLayout: PropTypes.func,
  storeContext: PropTypes.object,
  feedback: PropTypes.bool,
  setFeedback: PropTypes.func,
}
