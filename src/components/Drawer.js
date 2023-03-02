import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useExportUsfmZip } from 'zip-project'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import BugReportIcon from '@mui/icons-material/BugReport'
import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'

import { AppContext } from '@context/AppContext'

// TODO: Enable buttons once ready to fully implement functionality
// import DashboardIcon from '@mui/icons-material/Dashboard'
// import Crop54Icon from '@mui/icons-material/Crop54'
// import FolderIcon from '@mui/icons-material/Folder'
// import Divider from '@mui/material/Divider'
// import Button from '@mui/material/Button'

export default function Drawer({
  open,
  onOpen,
  onClose,
  resetResourceLayout,
  checkUnsavedChanges,
  showFeedback,
}) {
  const router = useRouter()

  const {
    state: { books },
  } = useContext(AppContext)

  const { handleExportZip } = useExportUsfmZip(books, 'gateway_zip')

  function onFeedbackClick() {
    onClose()
    showFeedback && showFeedback()
  }

  function onResetResourceLayout() {
    resetResourceLayout()
    onClose()
  }

  async function onCreateProjectClick() {
    // const okToContinue = await checkUnsavedChanges()

    // if (okToContinue) {
    router.push('/create-project')
    onClose()
    // }
  }

  function onSelectProjectClick() {
    router.push('/projects')
    onClose()
  }

  return (
    <SwipeableDrawer
      anchor='left'
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      classes={{ paper: 'w-72' }}
    >
      <div className='flex items-center flex-end py-2 px-2 bg-primary shadow-xs'>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon htmlColor='#fff' />
        </IconButton>
      </div>
      <List disablePadding>
        <ListItem button key={'Select Project'} onClick={onSelectProjectClick}>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText primary={'Select Project'} />
        </ListItem>
      </List>
      <List disablePadding>
        <ListItem button key={'Create Project'} onClick={onCreateProjectClick}>
          <ListItemIcon>
            <LibraryAddIcon />
          </ListItemIcon>
          <ListItemText primary={'Create Project'} />
        </ListItem>
      </List>
      <List disablePadding>
        <ListItem
          button
          key={'Save Zipped USFM Files'}
          onClick={handleExportZip}
        >
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={'Save Zipped USFM Files'} />
        </ListItem>
      </List>
      <List disablePadding>
        <ListItem
          button
          key={'Reset Resource Layout'}
          onClick={onResetResourceLayout}
        >
          <ListItemIcon>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={'Reset Resource Layout'} />
        </ListItem>
      </List>
      {/* <div className='mx-4 mt-2 m-1'>
        <Button variant='outlined' startIcon={<FolderIcon />}>
          Save Current Layout
        </Button>
      </div>
      <List disablePadding>
        <ListItem button key={'Templates Gallery'}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={'Templates Gallery'} />
        </ListItem>
        <ListItem button key={'Resource Gallery'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'Resource Gallery'} />
        </ListItem>
      </List>
      <Divider />
      <div className='text-gray-500 px-4 pt-2.5 text-xs'>Recently Used</div>
      <List disablePadding>
        <ListItem button key={'Translation Notes'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'Translation Notes'} />
        </ListItem>
        <ListItem button key={'My Review Process'}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={'My Review Process'} />
        </ListItem>
        <ListItem button key={'Translation Words'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'Translation Words'} />
        </ListItem>
      </List>
      <Divider />
      <div className='text-gray-500 px-4 pt-2.5 text-xs'>Bookmarked</div>
      <List disablePadding>
        <ListItem button key={'Translation Flow'}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={'Translation Flow'} />
        </ListItem>
        <ListItem button key={'Academy Articles'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'Academy Articles'} />
        </ListItem>
        <ListItem button key={'My Notes Setup'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'My Notes Setup'} />
        </ListItem>
        <ListItem button key={'All the Scripture'}>
          <ListItemIcon>
            <Crop54Icon />
          </ListItemIcon>
          <ListItemText primary={'All the Scripture'} />
        </ListItem>
        <ListItem button key={'My Book Package Flow'}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={'My Book Package Flow'} />
        </ListItem>
      </List>
      <Divider />
      <List disablePadding>
        <ListItem
          button
          key={'Bug Report or Feedback'}
          onClick={onFeedbackClick}
        >
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText primary={'Bug Report or Feedback'} />
        </ListItem>
      </List> */}
    </SwipeableDrawer>
  )
}

Drawer.propTypes = {
  open: PropTypes.bool,
  user: PropTypes.object,
  onOpen: PropTypes.func,
  logout: PropTypes.func,
  onClose: PropTypes.func,
  resetResourceLayout: PropTypes.func,
  checkUnsavedChanges: PropTypes.func,
  showFeedback: PropTypes.func,
}
