import { useState } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'

const FlashCardForm = ({ deckId, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    deckId: deckId
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setFormData({ ...formData, question: '', answer: '' })
      setError('')
    } catch (err) {
      setError('Failed to save flashcard')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Question"
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Answer"
        value={formData.answer}
        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
      >
        {initialData ? 'Update' : 'Add'} Flashcard
      </Button>
    </Box>
  )
}

export default FlashCardForm 