import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import MatchingGame from './pages/MatchingGame'

// Lazy load pages
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const Decks = lazy(() => import('./pages/Decks'))
const DeckEdit = lazy(() => import('./pages/DeckEdit'))
const Explore = lazy(() => import('./pages/Explore'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const RevisionSession = lazy(() => import('./pages/RevisionSession'))
const RevisionResult = lazy(() => import('./pages/RevisionResult'))
const DeckView = lazy(() => import('./pages/DeckView'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to="/decks" replace />
          ) : (
            <Layout>
              <Login />
            </Layout>
          )
        } />
        
        <Route path="/register" element={
          isAuthenticated ? (
            <Navigate to="/decks" replace />
          ) : (
            <Layout>
              <Register />
            </Layout>
          )
        } />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/decks" element={<Decks />} />
          <Route path="/decks/:id/edit" element={<DeckEdit />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/deck/:id" element={<DeckView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/revision/:revisionId/:index" element={<RevisionSession />} />
          <Route path="/revision/:revisionId/result" element={<RevisionResult />} />
          <Route path="/deck/:deckId/matching" element={<MatchingGame />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={
          <Layout>
            <Navigate to="/" replace />
          </Layout>
        } />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes 