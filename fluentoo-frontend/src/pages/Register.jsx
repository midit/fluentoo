import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material'
import { authService } from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Register form submitted', formData)
    
    try {
      console.log('Attempting registration...')
      const response = await authService.register(formData)
      console.log('Registration response:', response)

      if (response.data) {
        // After successful registration, log in the user
        console.log('Attempting automatic login...')
        const loginResponse = await authService.login({
          email: formData.email,
          password: formData.password
        })
        console.log('Login response:', loginResponse)

        if (loginResponse.data && loginResponse.data.token) {
          authService.setToken(loginResponse.data.token)
          navigate('/decks')
        } else {
          throw new Error('Invalid login response format')
        }
      } else {
        throw new Error('Invalid registration response format')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Button onClick={() => navigate('/login')} disabled={loading}>
              Login here
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
