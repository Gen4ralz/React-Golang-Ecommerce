import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Public = ({ children }) => {
  const { userSession } = useSelector((state) => state.authReducer);
  return userSession ? <Navigate to="/" /> : children;
};

export default Public;
