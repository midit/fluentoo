import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material'
import { authService } from '../services/api'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    dispatch(loginStart())
    console.log('Login attempt with email:', formData.email)
    
    try {
      console.log('Sending login request...')
      const response = await authService.login(formData)
      console.log('Login response received:', response)
      
      const responseData = response.data
      console.log('Response data:', responseData)
      
      if (!responseData) {
        throw new Error('No response data received')
      }
      
      if (!responseData.token) {
        throw new Error('No token received in response')
      }
      
      if (!responseData.user) {
        throw new Error('No user data received in response')
      }
      
      const { id, firstName, lastName, email, createdAt } = responseData.user
      const userData = { id, firstName, lastName, email, createdAt }
      
      console.log('Setting auth token and dispatching success')
      authService.setToken(responseData.token)
      dispatch(loginSuccess({
        token: responseData.token,
        user: userData
      }))
      navigate('/decks')
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      
      let errorMessage = 'Invalid credentials. Please try again.'
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      dispatch(loginFailure(errorMessage))
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Fluentoo
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 3 }}>
          by Maksym Patrushev
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            Don't have an account yet?{' '}
            <Button onClick={() => navigate('/register')} disabled={loading}>
              Register here
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login