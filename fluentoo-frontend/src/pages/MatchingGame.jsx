import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { matchingGameService, deckService } from '../services/api';
import Timer from '../components/game/Timer';
import MatchingCard from '../components/game/MatchingCard';
import GameCompletionDialog from '../components/game/GameCompletionDialog';

const MatchingGame = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await deckService.getDeck(deckId);
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        // Check if we have a deck with flashcards
        if (!response.data) {
          throw new Error('No deck data received from the API');
        }
        
        // The flashcards should be in the response.data.flashCards array (note the capital C)
        const flashcardsData = response.data.flashCards;
        console.log('Flashcards data:', flashcardsData);
        
        if (!flashcardsData || !Array.isArray(flashcardsData)) {
          throw new Error('No flashcards found in the deck or invalid format');
        }
        
        const cardPairs = flashcardsData.flatMap(card => [
          { id: `q_${card.id}`, type: 'question', content: card.question, flashcardId: card.id },
          { id: `a_${card.id}`, type: 'answer', content: card.answer, flashcardId: card.id }
        ]);
        
        // Fisher-Yates shuffle algorithm
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        
        const shuffledCards = shuffleArray([...cardPairs]);
        setCards(shuffledCards);
        setStartTime(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };
    initGame();
  }, [deckId]);

  const handleCardClick = async (cardId) => {
    if (
      selectedCards.length === 2 || 
      matchedPairs.has(cardId) || 
      selectedCards.includes(cardId)
    ) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      setAttempts(prev => prev + 1);

      // Check if one card is a question and the other is an answer
      if (firstId !== secondId && 
          firstCard.flashcardId === secondCard.flashcardId && 
          firstCard.type !== secondCard.type) {
        const newMatchedPairs = new Set([...matchedPairs, firstId, secondId]);
        setMatchedPairs(newMatchedPairs);

        // Check if all pairs are matched
        if (newMatchedPairs.size === cards.length) {
          const completionTime = Math.floor(
            (new Date().getTime() - startTime.getTime()) / 1000
          );
          
          const stats = {
            completionTime,
            attempts: attempts + 1,
            totalPairs: cards.length / 2
          };
          
          setGameStats(stats);
          setShowCompletion(true);
          setGameCompleted(true);

          // Save game stats in background
          matchingGameService.saveGame({
            deckId,
            completionTimeInSeconds: completionTime,
            totalPairs: cards.length / 2,
            totalAttempts: attempts + 1
          }).catch(error => {
            console.error('Error saving completed game:', error);
          });
        }
      }
      // Clear selection after a delay
      setTimeout(() => setSelectedCards([]), 1000);
    }
  };

  const handleCompletionClose = () => {
    setShowCompletion(false);
    // Check if we came from explore by checking the referrer
    const fromExplore = window.location.pathname.includes('/explore');
    if (fromExplore) {
      navigate(`/explore/deck/${deckId}`);
    } else {
      navigate('/decks');
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Matching Game</Typography>
        <Timer startTime={startTime} isCompleted={gameCompleted} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography>
          Matched: {matchedPairs.size / 2} / {cards.length / 2}
        </Typography>
        <Typography>
          Attempts: {attempts}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={6} sm={4} md={3} key={card.id}>
            <MatchingCard
              card={card}
              isFlipped={selectedCards.includes(card.id)}
              isMatched={matchedPairs.has(card.id)}
              onClick={() => handleCardClick(card.id)}
            />
          </Grid>
        ))}
      </Grid>

      {gameStats && (
        <GameCompletionDialog
          open={showCompletion}
          onClose={handleCompletionClose}
          stats={gameStats}
        />
      )}
    </Box>
  );
};

export default MatchingGame; 