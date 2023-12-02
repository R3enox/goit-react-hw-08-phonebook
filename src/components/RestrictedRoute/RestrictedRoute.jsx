import { CONTACTS_ROUTE } from 'constans/routes';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectAuthenticated } from '../../redux/auth/authSelectors';

const RestrictedRoute = ({ children, navigateTo = CONTACTS_ROUTE }) => {
  const authenticated = useSelector(selectAuthenticated);
  return authenticated ? <Navigate to={navigateTo} replace /> : children;
};

export default RestrictedRoute;
