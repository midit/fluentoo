import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, InputAdornment, alpha, useTheme, Chip, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PetsIcon from '@mui/icons-material/Pets';
import FlightIcon from '@mui/icons-material/Flight';
import ComputerIcon from '@mui/icons-material/Computer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import PaletteIcon from '@mui/icons-material/Palette';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PublicIcon from '@mui/icons-material/Public';
import ScienceIcon from '@mui/icons-material/Science';
import HomeIcon from '@mui/icons-material/Home';
import TheatersIcon from '@mui/icons-material/Theaters';
import TranslateIcon from '@mui/icons-material/Translate';
import { deckService } from '../services/api';
import usePageTitle from '../hooks/usePageTitle';

const MotionPaper = motion(Paper);

const CategoryCard = ({ category, selected, onClick }) => {
  const theme = useTheme();
  return (
    <MotionPaper
      elevation={2}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, selected ? 0.5 : 0.1)}`,
        cursor: 'pointer',
        backgroundColor: selected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .category-icon': {
            color: theme.palette.primary.dark,
          },
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
      }}
    >
      {React.cloneElement(category.icon, { className: 'category-icon' })}
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
        {category.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
        {category.description}
      </Typography>
    </MotionPaper>
  );
};

const FeaturedDeckCard = ({ deck, onClick }) => {
  const theme = useTheme();
  return (
    <MotionPaper
      elevation={2}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .deck-icon': {
            color: theme.palette.primary.dark,
          },
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoStoriesIcon 
          className="deck-icon"
          sx={{ 
            fontSize: 32,
            color: theme.palette.primary.main,
            mr: 1,
            transition: 'color 0.3s ease',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          {deck.name}
        </Typography>
        {deck.featured && (
          <StarIcon sx={{ color: theme.palette.warning.main, ml: 1 }} />
        )}
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flex: 1 }}>
        {deck.description}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {deck.tags?.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PlayArrowIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="textSecondary">
            {deck.launchCount || 0} launches
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {deck.cardCount} cards
        </Typography>
      </Box>
    </MotionPaper>
  );
};

const Explore = () => {
  usePageTitle('Explore');
  const navigate = useNavigate();
  const theme = useTheme();
  const [publicDecks, setPublicDecks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubjects();
    loadPublicDecks();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadPublicDecksBySubject(selectedSubject);
    } else {
      loadPublicDecks();
    }
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      const response = await deckService.getSubjects();
      console.log('Subjects loaded:', response.data);
      setSubjects(response.data);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setError('Failed to load categories');
    }
  };

  const loadPublicDecks = async () => {
    try {
      setLoading(true);
      const response = await deckService.getPublicDecks();
      console.log('Public decks loaded:', response.data);
      setPublicDecks(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load public decks:', err);
      setError('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicDecksBySubject = async (subjectId) => {
    try {
      setLoading(true);
      const response = await deckService.getPublicDecksBySubject(subjectId);
      console.log('Subject decks loaded:', response.data);
      setPublicDecks(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load decks by subject:', err);
      setError('Failed to load decks for this category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (subjectId) => {
    setSelectedSubject(subjectId === selectedSubject ? null : subjectId);
  };

  const handleDeckClick = (deckId) => {
    navigate(`/explore/deck/${deckId}`);
  };

  const filteredDecks = publicDecks.filter(deck => 
    (deck.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false
  );

  const categories = subjects.map(subject => {
    let icon;
    switch (subject.name) {
      case 'Animals':
        icon = <PetsIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Travel':
        icon = <FlightIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Technology':
        icon = <ComputerIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Food and Drink':
        icon = <RestaurantIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Business':
        icon = <BusinessCenterIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Sports':
        icon = <SportsBasketballIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Health and Fitness':
        icon = <FitnessCenterIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Education':
        icon = <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Art and Culture':
        icon = <PaletteIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'History':
        icon = <HistoryEduIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Geography':
        icon = <PublicIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Science':
        icon = <ScienceIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Everyday Life':
        icon = <HomeIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Entertainment':
        icon = <TheatersIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      case 'Languages':
        icon = <TranslateIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
        break;
      default:
        icon = <AutoStoriesIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />;
    }
    return {
      id: subject.id,
      name: subject.name,
      description: subject.description || `Explore ${subject.name} flashcard decks`,
      icon: icon,
    };
  });

  if (loading && !publicDecks.length) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Explore
      </Typography>

      <TextField
        fullWidth
        placeholder="Search decks..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <CategoryCard 
              category={category} 
              selected={category.id === selectedSubject}
              onClick={() => handleCategoryClick(category.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedSubject ? 'Category Decks' : 'Featured Decks'}
      </Typography>
      <Grid container spacing={3}>
        {filteredDecks.map((deck) => (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <FeaturedDeckCard 
              deck={{
                ...deck,
                name: deck.name || 'Untitled Deck',
                description: deck.description || 'No description available',
                tags: deck.subject ? [deck.subject.name] : [],
                launchCount: deck.launchCount || 0,
                cardCount: deck.flashCards?.length || 0,
                featured: deck.featured || false,
              }} 
              onClick={() => handleDeckClick(deck.id)}
            />
          </Grid>
        ))}
        {filteredDecks.length === 0 && !loading && (
          <Grid item xs={12}>
            <Typography textAlign="center" color="textSecondary">
              No decks found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Explore; 