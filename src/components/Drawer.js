import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import BugReportIcon from '@material-ui/icons/BugReport'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
// TODO: Enable buttons once ready to fully implement functionality
// import DashboardIcon from '@material-ui/icons/Dashboard'
// import Crop54Icon from '@material-ui/icons/Crop54'
// import FolderIcon from '@material-ui/icons/Folder'
// import Divider from '@material-ui/core/Divider'
// import Button from '@material-ui/core/Button'

export default function Drawer({
  user,
  open,
  onOpen,
  logout,
  onClose,
  resetResourceLayout,
  checkUnsavedChanges,
  showFeedback,
}) {
  const router = useRouter()

  async function onSettingsClick() {
    const okToContinue = await checkUnsavedChanges()

    if (okToContinue) {
      router.push('/settings')
      onClose()
    }
  }

  function onFeedbackClick() {
    onClose()
    showFeedback && showFeedback()
  }

  async function onLogout() {
    const okToContinue = await checkUnsavedChanges()

    if (okToContinue) {
      logout()
      onClose()
    }
  }

  function onResetResourceLayout() {
    resetResourceLayout()
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
      {user && (
        <div className='flex items-center mx-4 mt-2 mb-1'>
          <img
            className='w-10 h-10 rounded-full mr-4'
            src={
              user?.avatar_url ||
              'data:image/png;base64,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'
            }
            alt='Avatar'
            width='400'
            height='400'
          />
          <h1 className='flex-auto text-xl font-semibold my-3'>
            {user?.username || ''}
          </h1>
        </div>
      )}
      <List disablePadding>
        <ListItem button key={'Account Settings'} onClick={onSettingsClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={'Account Settings'} />
        </ListItem>
      </List>
      <List disablePadding>
        <ListItem button key={'Reset Resource Layout'} onClick={onResetResourceLayout}>
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
      <Divider /> */}
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
        {user && (
          <ListItem button key={'Logout'} onClick={onLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
        )}
      </List>
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
