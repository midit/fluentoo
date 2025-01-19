import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const MatchingCard = ({ card, isFlipped, isMatched, onClick }) => {
  const handleClick = () => {
    if (!isMatched) {
      onClick();
    }
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{
        height: '120px',
        cursor: isMatched ? 'default' : 'pointer',
        backgroundColor: isMatched ? '#4caf50' : (isFlipped ? '#e3f2fd' : '#fff'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        transform: isMatched ? 'none' : (isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'),
        opacity: isMatched ? 0.8 : 1,
        '&:hover': {
          transform: isMatched ? 'none' : (isFlipped ? 'rotateY(180deg) scale(1.05)' : 'rotateY(0) scale(1.05)'),
          boxShadow: isMatched ? 1 : 3
        }
      }}
    >
      <CardContent>
        <Typography 
          variant="body1" 
          align="center"
          sx={{
            transform: isMatched ? 'none' : (isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'),
            color: isMatched ? '#fff' : 'text.primary'
          }}
        >
          {isMatched || isFlipped ? card.content : '?'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MatchingCard; 