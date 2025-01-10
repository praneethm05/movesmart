import { Dashboard } from '../Screens/dashboard';
import { Profile } from '../pages/Profile';
import { Vehicle } from '../pages/Vehicle';
import { Redeem } from '../pages/Redeem';
import { Navigate } from '../pages/Navigate';

export const routes = [
  {
    path: '/',
    element: Dashboard,
  },
  {
    path: '/profile',
    element: Profile,
  },
  {
    path: '/vehicle',
    element: Vehicle,
  },
  {
    path: '/redeem',
    element: Redeem,
  },
  {
    path: '/navigate',
    element: Navigate,
  }
]; 