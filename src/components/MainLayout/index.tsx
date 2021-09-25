import React from 'react'

import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

import Sidebar from './Sidebar'

// style constant
const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%'
  },
  appBar: {
    backgroundColor: '#fff'
  },
  appBarWidth: {
    backgroundColor: '#fff'
  },
  content: {
    backgroundColor: '#fff',
    width: '100%',
    minHeight: 'calc(100vh - 88px)',
    flexGrow: 1,
    padding: '20px',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  contentShift: {
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
})

// ===========================|| MAIN LAYOUT ||=========================== //

const MainLayout = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {/* drawer */}
      <Sidebar />

      {/* main content */}
      <main className={clsx([classes.content])}>{children}</main>
    </div>
  )
}

export default MainLayout
