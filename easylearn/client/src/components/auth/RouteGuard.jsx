/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();

  if (!authenticated && !location.pathname.includes('/auth')) {
    return <Navigate to='/auth' />;
  }

  if (
    authenticated &&
    user?.role !== 'admin' &&
    (location.pathname.includes('/admin') ||
      location.pathname.includes('/auth'))
  ) {
    return <Navigate to='/home' />;
  }

  if (
    authenticated &&
    user?.role === 'admin' &&
    !location.pathname.includes('/admin')
  ) {
    return <Navigate to='/admin' />;
  }

  if (
    authenticated &&
    user?.role !== 'instructor' &&
    (location.pathname.includes('/instructor') ||
      location.pathname.includes('/auth'))
  ) {
    return <Navigate to='/home' />;
  }

  if (
    authenticated &&
    user?.role === 'instructor' &&
    !location.pathname.includes('/instructor')
  ) {
    return <Navigate to='/instructor' />;
  }

  if (
    authenticated &&
    user?.role === 'user' &&
    location.pathname.includes('/auth')
  ) {
    return <Navigate to='/home' />;
  }

  return <Fragment>{element}</Fragment>;
};

export default RouteGuard;
