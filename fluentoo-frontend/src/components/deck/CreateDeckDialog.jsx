import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { deckService } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const CreateDeckDialog = ({ open, onClose }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjectId: '',
    public_: false,
  })
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadSubjects()
      // Reset form data when dialog opens
      setFormData({
        name: '',
        description: '',
        subjectId: '',
        public_: false,
      })
      setError('')
    }
  }, [open])

  const loadSubjects = async () => {
    try {
      const response = await deckService.getSubjects()
      setSubjects(response.data)
    } catch (err) {
      console.error('Failed to load subjects:', err)
      setError('Failed to load subjects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }
    if (!formData.subjectId) {
      setError('Subject is required')
      setLoading(false)
      return
    }

    try {
      const response = await deckService.createDeck({
        ...formData,
        subjectId: Number(formData.subjectId), // Ensure subjectId is a number
      })
      onClose()
      navigate(`/decks/${response.data.id}/edit`)
    } catch (err) {
      console.error('Failed to create deck:', err)
      setError(err.response?.data?.message || 'Failed to create deck')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'public_' ? checked : value,
    }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Deck</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Deck Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
          
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              label="Subject"
              disabled={loading}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.public_}
                onChange={handleChange}
                name="public_"
                disabled={loading}
              />
            }
            label="Make deck public"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateDeckDialog 