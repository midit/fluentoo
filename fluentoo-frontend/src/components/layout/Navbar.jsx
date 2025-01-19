import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  alpha,
} from '@mui/material'
import { Add as AddIcon, AccountCircle, School as SchoolIcon } from '@mui/icons-material'
import { logout } from '../../store/slices/authSlice'
import CreateDeckDialog from '../deck/CreateDeckDialog'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [createDeckOpen, setCreateDeckOpen] = useState(false)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }

  const navItems = isAuthenticated ? [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Decks', path: '/decks' },
    { label: 'Explore', path: '/explore' },
  ] : []

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            mr: 4,
            '&:hover': {
              opacity: 0.9
            }
          }} 
          onClick={handleLogoClick}
        >
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Fluentoo</Typography>
        </Box>

        {/* Navigation Items */}
        {isAuthenticated ? (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    position: 'relative',
                    color: location.pathname === item.path ? 'primary.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.1),
                      color: 'primary.light',
                    },
                    '&::after': location.pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '30%',
                      height: '2px',
                      backgroundColor: 'primary.light',
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Action Buttons */}
            <IconButton
              color="inherit"
              onClick={() => setCreateDeckOpen(true)}
              sx={{ 
                mr: 1,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                }
              }}
              title="Create New Deck"
            >
              <AddIcon />
            </IconButton>

            <IconButton
              onClick={handleMenu}
              color="inherit"
              title="Account Menu"
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                }
              }}
            >
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 180,
                }
              }}
            >
              <MenuItem onClick={() => {
                handleClose()
                navigate('/dashboard')
              }}>
                My Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="inherit"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: alpha('#ffffff', 0.5),
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                  borderColor: '#ffffff',
                }
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>

      <CreateDeckDialog
        open={createDeckOpen}
        onClose={() => setCreateDeckOpen(false)}
      />
    </AppBar>
  )
}

export default Navbar 