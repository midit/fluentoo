import { Box } from '@mui/material'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          minHeight: 'calc(100vh - 64px)', // Subtract navbar height
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout