import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute () {
  const user = useSelector(state => state.Auth?.user)

  return user ? <Outlet /> : <Navigate to='/' replace />
}

export default ProtectedRoute
