import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Alert, 
  ButtonGroup,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Paper
} from '@mui/material'
import { 
  PlayArrow, 
  Edit, 
  Delete, 
  Add, 
  School, 
  Search,
  Sort,
  FilterList
} from '@mui/icons-material'
import { deckService, revisionService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import CreateDeckDialog from '../components/deck/CreateDeckDialog'
import usePageTitle from '../hooks/usePageTitle'

const Decks = () => {
  usePageTitle('My Decks')
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])
  const [filteredDecks, setFilteredDecks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('all')

  useEffect(() => {
    loadDecks()
    loadSubjects()
  }, [])

  useEffect(() => {
    filterAndSortDecks()
  }, [decks, searchQuery, sortBy, selectedSubject])

  const loadSubjects = async () => {
    try {
      const response = await deckService.getSubjects()
      setSubjects(response.data)
    } catch (err) {
      console.error('Failed to load subjects:', err)
    }
  }

  const loadDecks = async () => {
    setLoading(true)
    try {
      const response = await deckService.getMyDecks()
      setDecks(response.data)
    } catch (err) {
      setError('Failed to load decks')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortDecks = () => {
    let filtered = [...decks]

    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(deck => deck.subject?.id === selectedSubject)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(deck => 
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return 0
      }
    })

    setFilteredDecks(filtered)
  }

  const handleStartRevision = async (deckId) => {
    try {
      setError('');
      const response = await revisionService.startDeckRevision(deckId);
      if (response?.data?.id) {
        navigate(`/revision/${response.data.id}/0`);
      } else {
        throw new Error('Invalid revision response');
      }
    } catch (err) {
      console.error('Failed to start revision:', err);
      const message = err.response?.data?.message || 'Failed to start revision';
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone and will also delete all ongoing revisions.')) {
      try {
        await deckService.deleteDeck(id)
        setDecks(decks.filter(deck => deck.id !== id))
        setError(null)
      } catch (err) {
        console.error('Failed to delete deck:', err)
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to delete deck'
        setError(errorMessage)
        loadDecks()
      }
    }
  }

  const getDeckStats = () => {
    const totalDecks = decks.length
    const totalCards = decks.reduce((sum, deck) => sum + (deck.flashCards?.length || 0), 0)
    const subjectCount = new Set(decks.map(deck => deck.subject?.id)).size

    return { totalDecks, totalCards, subjectCount }
  }

  const stats = getDeckStats()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Your Decks</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateDialogOpen(true)}
          size="large"
        >
          Create New Deck
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.totalDecks}</Typography>
            <Typography color="textSecondary">Total Decks</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.totalCards}</Typography>
            <Typography color="textSecondary">Total Flashcards</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.subjectCount}</Typography>
            <Typography color="textSecondary">Subjects</Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              label="Subject"
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {subjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <Sort />
                </InputAdornment>
              }
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Decks Grid */}
      <Grid container spacing={3}>
        {filteredDecks.map(deck => (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>{deck.name}</Typography>
                  <Typography color="textSecondary" sx={{ mb: 1 }}>{deck.description}</Typography>
                  <Chip 
                    label={deck.subject?.name} 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="caption" display="block">
                    {deck.flashCards?.length || 0} flashcards
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <ButtonGroup fullWidth>
                    <Tooltip title="Practice with Flashcards">
                      <Button
                        startIcon={<PlayArrow />}
                        onClick={() => handleStartRevision(deck.id)}
                      >
                        Flashcards
                      </Button>
                    </Tooltip>
                    <Tooltip title="Play Matching Game">
                      <Button
                        startIcon={<School />}
                        onClick={() => navigate(`/deck/${deck.id}/matching`)}
                      >
                        Matching
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                  
                  <ButtonGroup fullWidth>
                    <Tooltip title="Edit Deck">
                      <Button
                        startIcon={<Edit />}
                        onClick={() => navigate(`/decks/${deck.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Deck">
                      <Button
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(deck.id)}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDecks.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary">
            {decks.length === 0 
              ? "You haven't created any decks yet. Create your first deck to get started!"
              : "No decks match your search criteria."
            }
          </Typography>
        </Box>
      )}

      <CreateDeckDialog
        open={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false)
          loadDecks()
        }}
      />
    </Box>
  )
}

export default Decks 