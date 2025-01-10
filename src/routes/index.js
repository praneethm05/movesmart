import { Dashboard } from '../Screens/dashboard';
import { Profile } from '../pages/Profile';
import { Vehicle } from '../pages/Vehicle';
import { Redeem } from '../pages/Redeem';

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
  }
]; 