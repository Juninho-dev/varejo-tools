import React from 'react'
import { useHistory, Link } from 'react-router-dom'

import ArchiveIcon from '@mui/icons-material/Archive'
import HomeIcon from '@mui/icons-material/Home'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

const MenuList = () => {
  const history = useHistory()
  return (
    <List>
      <Link to="/">
        <ListItemButton selected={history.location.pathname === '/'}>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </Link>
      <Link to="/upload/file">
        <ListItemButton selected={history.location.pathname === '/upload/file'}>
          <ListItemIcon>
            <ArchiveIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="XML" />
        </ListItemButton>
      </Link>
    </List>
  )
}

export default MenuList
