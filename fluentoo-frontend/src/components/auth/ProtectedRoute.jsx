import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from '../layout/Layout'

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectedRoute