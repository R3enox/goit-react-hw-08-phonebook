import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshThunk } from '../redux/auth/authThunk';
import * as ROUTES from '../constans/routes.js';
import RestrictedRoute from './RestrictedRoute/RestrictedRoute';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import { Loader } from './Loader/Loader';
import { Toaster } from 'react-hot-toast';
import Layout from './Layout/Layout';
import { selectAuthToken } from 'redux/auth/authSelectors';

const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const PhoneBook = lazy(() => import('../pages/PhoneBookPage/PhoneBookPage'));
const LogIn = lazy(() => import('../pages/LogInPage/LogInPage'));
const Register = lazy(() => import('../pages/RegisterPage/RegisterPage'));

const appRoutes = [
  {
    path: ROUTES.HOME_ROUTE,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN_ROUTE,
    element: (
      <RestrictedRoute navigateTo={ROUTES.CONTACTS_ROUTE}>
        <LogIn />
      </RestrictedRoute>
    ),
  },
  {
    path: ROUTES.REGISTER_ROUTE,
    element: (
      <RestrictedRoute navigateTo={ROUTES.HOME_ROUTE}>
        <Register />
      </RestrictedRoute>
    ),
  },
  {
    path: ROUTES.CONTACTS_ROUTE,
    element: (
      <PrivateRoute>
        <PhoneBook />
      </PrivateRoute>
    ),
  },
];

export const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

  useEffect(() => {
    if (!token) return;
    dispatch(refreshThunk());
  }, [dispatch, token]);

  return (
    <Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
        }}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};
