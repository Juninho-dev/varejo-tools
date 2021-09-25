import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

// material-ui
import { Box, Drawer } from '@mui/material'
import { makeStyles } from '@mui/styles'

// third-party

// project imports
import Logo from '../../Logo'
import MenuList from './MenuList'

// style constant
const useStyles = makeStyles({
  drawer: {
    width: 200,
    flexShrink: 0
  },
  drawerPaper: {
    width: 200,
    background: '#fff',
    color: '#000',
    borderRight: 'none'
  },
  ScrollHeight: {
    height: 'calc(100vh - 88px)'
  },
  boxContainer: {
    display: 'flex',
    padding: '10px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

// ===========================|| SIDEBAR DRAWER ||=========================== //

const Sidebar = () => {
  const classes = useStyles()

  const drawer = (
    <>
      <PerfectScrollbar component="div" className={classes.ScrollHeight}>
        <MenuList />
      </PerfectScrollbar>
    </>
  )

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <div>{drawer}</div>
    </nav>
  )
}

export default Sidebar
