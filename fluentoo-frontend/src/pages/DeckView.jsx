import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { deckService, revisionService } from '../services/api';
import { useSnackbar } from 'notistack';
import usePageTitle from '../hooks/usePageTitle';

const DeckView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle('View Deck');

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    try {
      setLoading(true);
      const response = await deckService.getDeck(id);
      setDeck(response.data);
    } catch (error) {
      console.error('Failed to load deck:', error);
      enqueueSnackbar('Failed to load deck', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartRevision = async () => {
    try {
      const response = await revisionService.startDeckRevision(id);
      if (response?.data?.id) {
        await loadDeck();
        navigate(`/revision/${response.data.id}/0`);
      } else {
        throw new Error('Invalid revision response');
      }
    } catch (err) {
      console.error('Failed to start revision:', err);
      const message = err.response?.data?.message || 'Failed to start revision';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const handleStartMatchingGame = () => {
    navigate(`/deck/${id}/matching`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!deck) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Deck not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              {deck.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {deck.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {deck.subject && (
            <Chip
              label={deck.subject.name}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <PlayArrowIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {deck.launchCount || 0} launches
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartRevision}
              sx={{ height: '48px' }}
            >
              Start Flashcards
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SchoolIcon />}
              onClick={handleStartMatchingGame}
              sx={{ height: '48px' }}
            >
              Play Matching Game
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Flashcards ({deck.flashCards?.length || 0})
      </Typography>

      <Grid container spacing={2}>
        {deck.flashCards?.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Card {index + 1}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Q: {flashcard.question}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A: {flashcard.answer}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {(!deck.flashCards || deck.flashCards.length === 0) && (
        <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
          This deck has no flashcards yet.
        </Typography>
      )}
    </Box>
  );
};

export default DeckView; 