import React from 'react'
import { useHistory, Link } from 'react-router-dom'

import ArchiveIcon from '@mui/icons-material/Archive'
import HomeIcon from '@mui/icons-material/Home'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

const MenuList = () => {
  const history = useHistory()
  return (
    <List>
      <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton selected={history.location.pathname === '/'}>
          <ListItemIcon>
            <HomeIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </Link>
      <Link to="/upload/file" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton selected={history.location.pathname === '/upload/file'}>
          <ListItemIcon>
            <ArchiveIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="XML" />
        </ListItemButton>
      </Link>
    </List>
  )
}

export default MenuList
