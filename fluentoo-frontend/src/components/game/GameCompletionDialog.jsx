import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import { EmojiEvents, Timer, Speed, CheckCircle } from '@mui/icons-material';

const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const StatBox = ({ icon: Icon, value, label }) => (
  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
    <Icon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
    <Typography variant="h6" gutterBottom>
      {value}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
  </Paper>
);

const GameCompletionDialog = ({ open, onClose, stats }) => {
  if (!stats) return null;

  const accuracy = stats.attempts ? Math.round((stats.totalPairs / stats.attempts) * 100) : 0;
  const averageTimePerMatch = stats.completionTime ? Math.round(stats.completionTime / stats.totalPairs) : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <EmojiEvents sx={{ fontSize: 60, color: 'gold', mb: 2 }} />
        <Typography variant="h4">Congratulations!</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" gutterBottom>
            You've completed the matching game!
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <StatBox
                icon={Timer}
                value={formatTime(stats.completionTime)}
                label="Total Time"
              />
            </Grid>
            <Grid item xs={6}>
              <StatBox
                icon={Speed}
                value={`${averageTimePerMatch}s`}
                label="Avg. Time per Match"
              />
            </Grid>
            <Grid item xs={6}>
              <StatBox
                icon={CheckCircle}
                value={`${accuracy}%`}
                label="Accuracy"
              />
            </Grid>
            <Grid item xs={6}>
              <StatBox
                icon={EmojiEvents}
                value={stats.attempts}
                label="Total Attempts"
              />
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
            Keep practicing to improve your matching skills!
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" onClick={onClose} color="primary">
          Back to Decks
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameCompletionDialog; 