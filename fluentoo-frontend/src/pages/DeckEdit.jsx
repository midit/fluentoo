import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deckService } from '../services/api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

const DeckEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [deck, setDeck] = useState(null);
  const [flashcardForm, setFlashcardForm] = useState({
    question: '',
    answer: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    try {
      const response = await deckService.getDeck(id);
      setDeck(response.data);
    } catch (error) {
      console.error('Failed to load deck:', error);
      enqueueSnackbar('Failed to load deck', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardSubmit = async (e) => {
    e.preventDefault();
    try {
      await deckService.createFlashcard({
        question: flashcardForm.question,
        answer: flashcardForm.answer,
        deckId: id,
      });
      setFlashcardForm({ question: '', answer: '' });
      loadDeck(); // Reload deck to show new flashcard
      enqueueSnackbar('Flashcard created successfully', { variant: 'success' });
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      enqueueSnackbar('Failed to create flashcard', { variant: 'error' });
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await deckService.deleteFlashcard(flashcardId);
      loadDeck(); // Reload deck to update flashcard list
      enqueueSnackbar('Flashcard deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      enqueueSnackbar('Failed to delete flashcard', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!deck) {
    return (
      <Container>
        <Typography>Deck not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Deck: {deck.name}
      </Typography>

      {/* Flashcard Creation Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Flashcard
        </Typography>
        <form onSubmit={handleFlashcardSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Question"
                value={flashcardForm.question}
                onChange={(e) =>
                  setFlashcardForm({ ...flashcardForm, question: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Answer"
                value={flashcardForm.answer}
                onChange={(e) =>
                  setFlashcardForm({ ...flashcardForm, answer: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Flashcard
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Flashcards List */}
      <Typography variant="h6" gutterBottom>
        Flashcards ({deck.flashCards?.length || 0})
      </Typography>
      <Grid container spacing={2}>
        {deck.flashCards?.map((flashcard) => (
          <Grid item xs={12} sm={6} key={flashcard.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Question: {flashcard.question}
                    </Typography>
                    <Typography variant="subtitle1">
                      Answer: {flashcard.answer}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDeleteFlashcard(flashcard.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(!deck.flashCards || deck.flashCards.length === 0) && (
        <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
          No flashcards yet. Add some using the form above!
        </Typography>
      )}
    </Container>
  );
};

export default DeckEdit; 