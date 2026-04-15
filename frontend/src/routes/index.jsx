import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import LandingPage from '../pages/LandingPage/LandingPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import ExplorePage from '../pages/Explore/ExplorePage';
import DeckList from '../pages/Deck/DeckList';
import DeckDetail from '../pages/Deck/DeckDetail';
import ReviewPage from '../pages/Review/ReviewPage';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';

// Admin
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageDecks from '../pages/Admin/ManageDecks';

// Auth guard
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<PrivateRoute allowRoles={['learner', 'admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="decks" element={<DeckList />} />
          <Route path="decks/:id" element={<DeckDetail />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="review/:id" element={<ReviewPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="decks" element={<ManageDecks />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
