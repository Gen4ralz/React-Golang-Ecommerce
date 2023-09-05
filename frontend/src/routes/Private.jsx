import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Private = ({ children }) => {
  const { userSession } = useSelector((state) => state.authReducer);
  return userSession ? children : <Navigate to="/signin" />;
};

export default Private;
