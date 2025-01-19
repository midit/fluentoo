import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const Timer = ({ startTime, isCompleted }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!startTime || isCompleted) return;

    const interval = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      setTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Typography variant="h5" component="div">
      {formatTime(time)}
    </Typography>
  );
};

export default Timer; 