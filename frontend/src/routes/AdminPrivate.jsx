import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminPrivate = ({ children }) => {
  const { userSession } = useSelector((state) => state.authReducer)

  return userSession && userSession.user.role == 'admin' ? (
    children
  ) : (
    <Navigate to="/" />
  )
}

export default AdminPrivate
