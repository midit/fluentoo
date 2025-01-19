import { Box, Typography, Grid, Paper, useTheme, alpha, CircularProgress, Alert, Button, Skeleton, Tooltip, IconButton, Collapse } from '@mui/material'
import { motion } from 'framer-motion'
import TimelineIcon from '@mui/icons-material/Timeline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import EditIcon from '@mui/icons-material/Edit'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState, useEffect } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { userStatsService } from '../services/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'
import DailyGoalDialog from '../components/DailyGoalDialog'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
)

const MotionPaper = motion(Paper)

const StatCard = ({ icon: Icon, title, value, subtitle, loading, showHelp, helpText }) => {
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
        transition: 'all 0.3s ease',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .stat-icon': {
            color: theme.palette.primary.dark,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon 
          className="stat-icon"
          sx={{ 
            fontSize: 32,
            color: theme.palette.primary.main,
            mr: 1,
            transition: 'color 0.3s ease',
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          {showHelp && (
            <Tooltip title={
              <Box sx={{ p: 1 }}>
                <Typography variant="body2">
                  {helpText}
                </Typography>
              </Box>
            } arrow>
              <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {loading ? (
        <Skeleton variant="text" width="60%" height={60} />
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </>
      )}
    </MotionPaper>
  )
}

const ProgressCard = ({ title, progress, subtitle, loading, showHelp }) => {
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
        alignItems: 'center',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mr: 3 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="div" color="textSecondary">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {title}
              </Typography>
              {showHelp && (
                <Tooltip title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Overall Progress is calculated from:
                    </Typography>
                    <Typography variant="body2" component="div">
                      • Study Streak (30%): Based on consecutive days studied (max 30 days)<br/>
                      • Cards Reviewed (40%): Based on total cards reviewed (max 1000 cards)<br/>
                      • Matching Games (30%): Based on games completed (max 50 games)
                    </Typography>
                  </Box>
                } arrow>
                  <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </Box>
        </>
      )}
    </MotionPaper>
  )
}

const LearningChart = ({ data, loading }) => {
  const theme = useTheme()

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Cards Reviewed',
        data: data?.values || [],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.text.primary, 0.1),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

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
        minHeight: 400,
        transition: 'all 0.3s ease',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon 
          sx={{ 
            fontSize: 32,
            color: theme.palette.primary.main,
            mr: 1,
          }}
        />
        <Typography variant="h6" color="textSecondary">
          Learning Activity
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: '300px' }}>
          <Line data={chartData} options={options} />
        </Box>
      )}
    </MotionPaper>
  )
}

const DailyGoalTracker = ({ completedDays, loading }) => {
  const theme = useTheme()
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  const adjustedToday = today === 0 ? 6 : today - 1 // Convert to 0 = Monday, 6 = Sunday

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Daily Goal Completion
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {days.map((day, index) => (
          <Box
            key={day}
            sx={{
              flex: 1,
              p: 1,
              borderRadius: 1,
              textAlign: 'center',
              bgcolor: completedDays.includes(index) ? theme.palette.primary.main : 'background.default',
              color: completedDays.includes(index) ? 'white' : 'text.primary',
              border: `1px solid ${theme.palette.divider}`,
              opacity: loading ? 0.5 : 1,
              position: 'relative',
              '&::after': index === adjustedToday ? {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: `6px solid ${theme.palette.primary.main}`,
              } : {},
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const Dashboard = () => {
  usePageTitle('Dashboard')
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    studyStreak: 0,
    pointsEarned: 0,
    cardsReviewed: 0,
    totalStudyTime: 0,
    overallProgress: 0,
    dailyGoalProgress: 0,
    cardsLeftToday: 0,
    dailyGoal: 50,
    matchingGamesCompleted: 0,
    matchingGamePoints: 0,
    totalMatchesFound: 0,
    totalMatchingAttempts: 0,
    decksStudied: 0,
  })
  const [chartData, setChartData] = useState({
    labels: [],
    values: []
  })
  const [isDailyGoalDialogOpen, setIsDailyGoalDialogOpen] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsResponse, chartResponse] = await Promise.all([
          userStatsService.getStats(),
          userStatsService.getLearningActivity()
        ])

        console.log('Stats response:', statsResponse.data)
        console.log('Chart response:', chartResponse.data)

        setStats(prev => ({
          ...prev,
          ...(statsResponse.data || {})
        }))
        
        setChartData(prev => ({
          ...prev,
          ...(chartResponse.data || {})
        }))
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatTime = (minutes) => {
    if (typeof minutes !== 'number') return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0'
    return num.toLocaleString()
  }

  const handleDailyGoalSet = (newGoal) => {
    setStats(prev => ({
      ...prev,
      dailyGoal: newGoal
    }))
  }

  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={WhatshotIcon}
            title="Study Streak"
            value={`${stats.studyStreak || 0} Days`}
            subtitle="Keep up the momentum!"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={EmojiEventsIcon}
            title="Points Earned"
            value={formatNumber(stats.pointsEarned)}
            subtitle="Total points earned"
            loading={loading}
            showHelp={true}
            helpText="Points are earned through various activities:
• Correct flashcard answers: +15 points
• Wrong flashcard answers: -5 points
• Matching game: +5 points per matched pair
• Daily goal completion: Points based on cards reviewed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AutoStoriesIcon}
            title="Cards Reviewed"
            value={formatNumber(stats.cardsReviewed)}
            subtitle="Total cards reviewed"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AccessTimeIcon}
            title="Decks Studied"
            value={formatNumber(stats.decksStudied)}
            subtitle="Total decks studied"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3, mt: 4 }}>
        Matching Game Stats
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TimelineIcon}
            title="Games Completed"
            value={formatNumber(stats.matchingGamesCompleted)}
            subtitle="Total games played"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={EmojiEventsIcon}
            title="Game Points"
            value={formatNumber(stats.matchingGamePoints)}
            subtitle="Total points earned"
            loading={loading}
            showHelp={true}
            helpText="Matching Game points:
• Each matched pair: 5 points
• Points are added to both game points and total points earned
• Points are awarded upon game completion"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AutoStoriesIcon}
            title="Matches Found"
            value={formatNumber(stats.totalMatchesFound)}
            subtitle="Total correct matches"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AccessTimeIcon}
            title="Match Accuracy"
            value={`${stats.matchAccuracy}%`}
            subtitle="Overall mean accuracy"
            loading={loading}
            showHelp={true}
            helpText="Match Accuracy:
• Calculated as (total correct matches / total attempts) × 100
• Shows your overall success rate across all games
• Higher accuracy means better matching performance"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <ProgressCard
              title="Daily Goal"
              progress={stats.dailyGoalProgress || 0}
              subtitle={`${stats.cardsLeftToday || 0} cards left to review today`}
              loading={loading}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setIsDailyGoalDialogOpen(true)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
              }}
            >
              Set Goal
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <DailyGoalTracker 
            completedDays={stats.completedDailyGoals || []}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LearningChart data={chartData} loading={loading} />
        </Grid>
      </Grid>

      <DailyGoalDialog
        open={isDailyGoalDialogOpen}
        onClose={() => setIsDailyGoalDialogOpen(false)}
        currentGoal={stats.dailyGoal}
        onGoalSet={handleDailyGoalSet}
      />
    </Box>
  )
}

export default Dashboard 