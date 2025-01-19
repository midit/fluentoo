import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  LinearProgress,
  Container,
  IconButton,
  Fade,
  Paper,
  CircularProgress
} from '@mui/material'
import { ArrowBack, NavigateNext } from '@mui/icons-material'
import { revisionService } from '../services/api'

const RevisionSession = () => {
  const { revisionId, index } = useParams()
  const navigate = useNavigate()
  const [revision, setRevision] = useState(null)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRevision = async () => {
      try {
        setLoading(true)
        const response = await revisionService.getRevision(revisionId)
        if (!response.data) {
          throw new Error('No data received from server')
        }
        
        const flashcards = response.data.flashcards || []
        setRevision({
          id: revisionId,
          flashcards: flashcards,
          currentCard: flashcards[parseInt(index) || 0],
          totalFlashcards: flashcards.length,
          progress: ((parseInt(index) || 0) / flashcards.length) * 100,
          deckId: response.data.deck.id,
          startTime: new Date().toISOString()
        })
      } catch (err) {
        console.error("Failed to load revision:", err)
        setError(err.response?.data?.message || "Failed to load revision")
      } finally {
        setLoading(false)
      }
    }
    loadRevision()
  }, [revisionId, index])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return

    try {
      setSubmitting(true)
      setError('')

      const isCorrect = answer.trim().toLowerCase() === revision.currentCard.answer.trim().toLowerCase()
      const newAnswers = [...answers, isCorrect]
      setAnswers(newAnswers)
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1)
      }

      // Submit answer to backend
      await revisionService.submitAnswer(revisionId, {
        correct: isCorrect,
        answer: answer.trim()
      })

      const nextIndex = parseInt(index) + 1
      if (nextIndex < revision.flashcards.length) {
        setRevision(prevRevision => ({
          ...prevRevision,
          currentCard: prevRevision.flashcards[nextIndex],
          progress: (nextIndex / prevRevision.flashcards.length) * 100
        }))
        setAnswer('')
        navigate(`/revision/${revisionId}/${nextIndex}`)
      } else {
        navigate(`/revision/${revisionId}/result`)
      }
    } catch (err) {
      console.error("Failed to process answer:", err)
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
        navigate('/login')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to submit this answer.')
      } else {
        setError(err.response?.data?.message || "Failed to process answer. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (revision) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate('/decks')} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">
              Revision Session
            </Typography>
          </Box>

          <Paper sx={{ mb: 3, p: 1, bgcolor: 'background.default' }}>
            <LinearProgress 
              variant="determinate" 
              value={revision.progress} 
              sx={{ 
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ mt: 1 }}
            >
              Question {parseInt(index) + 1} of {revision.flashcards.length}
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Fade in={true} timeout={300}>
            <Card sx={{ 
              mb: 4,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
              transition: 'box-shadow 0.3s ease-in-out'
            }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  component="div"
                  sx={{ 
                    mb: 3,
                    fontWeight: 500,
                    color: 'primary.main'
                  }}
                >
                  {revision.currentCard.question}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Your Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    disabled={submitting}
                    multiline
                    rows={3}
                    sx={{ mb: 3 }}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting || !answer.trim()}
                    endIcon={submitting ? <CircularProgress size={20} /> : <NavigateNext />}
                    sx={{ 
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Container>
    )
  } else {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Alert 
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/decks')}>
                Return to Decks
              </Button>
            }
          >
            {error || 'Revision or flashcard not found'}
          </Alert>
        </Box>
      </Container>
    )
  }
}

export default RevisionSession 