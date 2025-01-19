import { Box, Typography, Button, Container, Grid, Paper, useTheme, useMediaQuery, alpha, Avatar, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SchoolIcon from '@mui/icons-material/School'
import TimelineIcon from '@mui/icons-material/Timeline'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CreateIcon from '@mui/icons-material/Create'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import InsightsIcon from '@mui/icons-material/Insights'
import { motion } from 'framer-motion'
import usePageTitle from '../hooks/usePageTitle'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

const FeatureCard = ({ icon: Icon, title, description }) => {
  const theme = useTheme()
  return (
    <MotionPaper
      elevation={2}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .feature-icon': {
            color: theme.palette.primary.dark,
          },
        },
      }}
    >
      <Icon 
        className="feature-icon"
        sx={{ 
          fontSize: { xs: 32, sm: 40 }, 
          color: theme.palette.primary.main,
          mb: { xs: 1, sm: 2 },
          transition: 'color 0.3s ease',
        }} 
      />
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          color: theme.palette.text.primary,
          fontWeight: 600
        }}
      >
        {title}
      </Typography>
      <Typography 
        sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          color: theme.palette.text.secondary,
          lineHeight: 1.6
        }}
      >
        {description}
      </Typography>
    </MotionPaper>
  )
}

const StatisticCard = ({ icon: Icon, value, label }) => {
  const theme = useTheme()
  return (
    <MotionPaper
      elevation={3}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        background: '#fff',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .icon': {
            transform: 'scale(1.1)',
            color: theme.palette.primary.dark,
          },
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Icon
        className="icon"
        sx={{
          fontSize: 48,
          color: theme.palette.primary.main,
          mb: 2,
          transition: 'transform 0.3s ease',
        }}
      />
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 1,
          fontSize: { xs: '2rem', sm: '2.5rem' },
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: '1rem', sm: '1.25rem' },
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </MotionPaper>
  )
}

const TestimonialCard = ({ name, role, content, avatar }) => {
  const theme = useTheme()
  return (
    <MotionPaper
      elevation={2}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        position: 'relative',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .quote-mark': {
            color: alpha(theme.palette.primary.main, 0.2),
          }
        },
      }}
    >
      <Typography
        className="quote-mark"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: '4rem',
          color: alpha(theme.palette.primary.main, 0.1),
          fontFamily: 'serif',
          lineHeight: 1,
          transition: 'color 0.3s ease',
          userSelect: 'none',
        }}
      >
        "
      </Typography>
      <Typography
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          fontSize: '1rem',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
          pl: 2,
        }}
      >
        {content}
      </Typography>
      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
        <Avatar src={avatar} sx={{ width: 48, height: 48, mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, opacity: 0.9 }}>
            {role}
          </Typography>
        </Box>
      </Box>
    </MotionPaper>
  )
}

const StepCard = ({ number, title, description, icon: Icon }) => {
  const theme = useTheme()
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{ 
        textAlign: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
          },
        }}
      >
        <Icon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      </Box>
      <Typography variant="h4" color="primary" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
        {number}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        {description}
      </Typography>
    </MotionBox>
  )
}

const LanguagePreview = () => {
  const theme = useTheme()
  const languages = ['English', 'Spanish', 'Polish', 'German', 'Ukrainian', 'Italian', 'French']
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
      {languages.map((lang, index) => (
        <MotionBox
          key={lang}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Chip
            label={lang}
            sx={{
              bgcolor: '#fff',
              color: theme.palette.primary.main,
              fontWeight: 500,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.7)',
              },
            }}
          />
        </MotionBox>
      ))}
    </Box>
  )
}

const Home = () => {
  usePageTitle('Home')
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const features = [
    {
      icon: AutoStoriesIcon,
      title: 'Flashcards',
      description: 'Create and study with interactive flashcards for effective memorization.'
    },
    {
      icon: TimelineIcon,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed statistics and insights.'
    },
    {
      icon: PeopleIcon,
      title: 'Community',
      description: 'Share and access decks created by the community.'
    },
    {
      icon: EmojiEventsIcon,
      title: 'Games & Challenges',
      description: 'Make learning fun with interactive games and daily challenges.'
    }
  ]

  const statistics = [
    {
      icon: PeopleIcon,
      value: '10,000+',
      label: 'Active Learners',
    },
    {
      icon: MenuBookIcon,
      value: '50,000+',
      label: 'Flashcards Created',
    },
    {
      icon: EmojiEventsIcon,
      value: '95%',
      label: 'Success Rate',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Your Deck',
      description: 'Build your custom flashcard deck or choose from existing ones',
      icon: CreateIcon,
    },
    {
      number: '2',
      title: 'Start Learning',
      description: 'Practice with our intelligent spaced repetition system',
      icon: PlayArrowIcon,
    },
    {
      number: '3',
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics',
      icon: InsightsIcon,
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Language Enthusiast',
      content: `Fluentoo has transformed the way I learn languages. The spaced repetition system is incredibly effective, and I've seen remarkable progress in my vocabulary retention.`,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      content: `As a busy student, I appreciate how Fluentoo helps me make the most of my study time. The analytics help me focus on what I need to review most.`,
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Language Teacher',
      content: `I recommend Fluentoo to all my students. It's the perfect complement to classroom learning, and the custom deck feature is invaluable.`,
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.primary.light, 0.9)} 100%)`,
          color: 'white',
          pt: { xs: 8, sm: 12 },
          pb: { xs: 8, sm: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 15%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 15%)',
            opacity: 0.8,
          },
        }}
      >
        <Container 
          maxWidth="md" 
          disableGutters
          sx={{ px: { xs: 2, sm: 3 } }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                color: '#fff',
                fontWeight: 800,
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '2.5rem', sm: '3.75rem' },
                lineHeight: { xs: 1.2, sm: 1.167 },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Master Languages with Fluentoo
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                maxWidth: '800px',
                fontSize: { xs: '1.125rem', sm: '1.5rem' },
                px: { xs: 1, sm: 2 },
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.6,
              }}
            >
              Accelerate your language learning journey with our intelligent flashcard system.
              Learn smarter, not harder.
            </Typography>
            <LanguagePreview />
            {!isAuthenticated && (
              <MotionBox 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{ mt: { xs: 4, sm: 6 } }}
              >
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate('/register')}
                  sx={{
                    mr: { xs: 1, sm: 2 },
                    mb: { xs: 1, sm: 0 },
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Login
                </Button>
              </MotionBox>
            )}
          </MotionBox>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container 
        maxWidth="lg" 
        disableGutters
        sx={{ 
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Grid container spacing={4}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StatisticCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container 
        maxWidth="lg" 
        disableGutters
        sx={{ 
          py: { xs: 4, sm: 8 },
          px: { xs: 2, sm: 3 },
          position: 'relative' 
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            mb: { xs: 4, sm: 6 },
            fontSize: { xs: '2rem', sm: '3rem' },
            fontWeight: 700,
            color: theme.palette.text.primary,
            position: 'relative',
          }}
        >
          Why Choose Fluentoo?
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box 
        sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          py: { xs: 4, sm: 8 },
          position: 'relative',
        }}
      >
        <Container 
          maxWidth="md"
          disableGutters
          sx={{ px: { xs: 2, sm: 3 } }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '3rem' },
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mb: { xs: 3, sm: 4 },
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Start learning in three simple steps
          </Typography>
          <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ mt: { xs: 0, sm: 2 } }}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StepCard {...step} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, sm: 8 } }}>
        <Container 
          maxWidth="lg"
          disableGutters
          sx={{ px: { xs: 2, sm: 3 } }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', sm: '3rem' },
              fontWeight: 700,
              mb: { xs: 4, sm: 6 },
            }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TestimonialCard {...testimonial} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      {!isAuthenticated && (
        <Box 
          sx={{ 
            py: { xs: 4, sm: 8 }, 
            textAlign: 'center',
            background: '#fff',
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Container 
            maxWidth="sm"
            disableGutters
            sx={{ px: { xs: 2, sm: 3 } }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Ready to Start Learning?
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 2, sm: 0 },
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Join thousands of learners who are already mastering new languages with Fluentoo.
              </Typography>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                onClick={() => navigate('/register')}
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1, sm: 1.5 },
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                Create Free Account
              </Button>
            </MotionBox>
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default Home