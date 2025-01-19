import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { userStatsService } from '../services/api';

const DailyGoalDialog = ({ open, onClose, currentGoal, onGoalSet }) => {
  const [goal, setGoal] = useState(currentGoal || 50);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (goal < 1) {
      setError('Daily goal must be at least 1');
      return;
    }

    try {
      await userStatsService.setDailyGoal(goal);
      onGoalSet(goal);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set daily goal');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Daily Goal</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" gutterBottom>
            Set the number of flashcards you want to review each day.
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Daily Goal"
            value={goal}
            onChange={(e) => {
              setGoal(parseInt(e.target.value) || 0);
              setError('');
            }}
            error={!!error}
            helperText={error}
            InputProps={{
              inputProps: { min: 1 }
            }}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DailyGoalDialog; 