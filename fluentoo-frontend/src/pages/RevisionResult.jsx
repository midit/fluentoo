import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import { Pie, Line } from 'react-chartjs-2'
import { revisionService } from '../services/api'
import '../utils/chartConfig'  // Import Chart.js configuration

const RevisionResult = () => {
  const { revisionId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadResult()
  }, [revisionId])

  useEffect(() => {
    if (result?.deck?.id) {
      loadProgressData(result.deck.id)
    }
  }, [result])

  const loadResult = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await revisionService.getRevision(revisionId)
      
      if (!response.data) {
        throw new Error('No data received from server')
      }

      setResult(response.data)
    } catch (err) {
      console.error('Failed to load result:', err)
      setError(err.response?.data?.message || 'Failed to load revision results')
    } finally {
      setLoading(false)
    }
  }

  const loadProgressData = async (deckId) => {
    try {
      const response = await revisionService.getProgress();
      
      if (!response.data || !Array.isArray(response.data)) {
        return;
      }

      const deckRevisions = response.data
        .filter(rev => rev.totalCards > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-10);

      if (deckRevisions.length > 0) {
        setProgressData({
          labels: deckRevisions.map(rev => new Date(rev.date).toLocaleDateString()),
          datasets: [{
            label: result?.deck?.name || 'Current Deck',
            data: deckRevisions.map(rev => (rev.correctCards / rev.totalCards) * 100),
            borderColor: '#005C44',
            backgroundColor: 'rgba(0, 92, 68, 0.1)',
            fill: true,
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2
          }]
        });
      }
    } catch (err) {
      console.error('Failed to load progress data:', err);
      setProgressData(null);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/decks')}>
          Back to Decks
        </Button>
      </Box>
    )
  }

  if (!result) return null

  const pieData = {
    labels: ['Incorrect', 'Correct'],
    datasets: [{
      data: [
        result.totalFlashcards - result.correctFlashcards,
        result.correctFlashcards
      ],
      backgroundColor: ['#E63946', '#3AB795']
    }]
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Revision Results
            </Typography>
            <Typography variant="h3" sx={{ textAlign: 'center', my: 4 }}>
              {result.percentage ? Math.round(result.percentage) : 0}%
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={pieData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                layout: {
                  padding: {
                    top: 20,
                    bottom: 20
                  }
                }
              }} />
            </Box>
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              {result.correctFlashcards} out of {result.totalFlashcards} correct
            </Typography>
          </CardContent>
        </Card>

        {progressData && (
          <Card sx={{ flex: 2, minWidth: 500 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Progress Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={progressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Score (%)'
                        },
                        ticks: {
                          callback: value => `${value}%`
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Revision Date'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Score: ${context.parsed.y}%`,
                          title: (tooltipItems) => `Date: ${tooltipItems[0].label}`
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained"
          onClick={() => navigate('/decks')}
          sx={{ mr: 2 }}
        >
          Back to Decks
        </Button>
        <Button 
          variant="outlined"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  )
}

export default RevisionResult 