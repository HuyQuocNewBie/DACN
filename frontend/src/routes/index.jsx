import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import DeckList from '../pages/Deck/DeckList';
import DeckDetail from '../pages/Deck/DeckDetail';
import ReviewPage from '../pages/Review/ReviewPage';
import NotFound from '../pages/NotFound';

// Bảo mật
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PRIVATE ROUTES ================= */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>

          {/* Redirect "/" -> "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* ================= DECK ================= */}
          <Route path="decks" element={<DeckList />} />
          <Route path="decks/:id" element={<DeckDetail />} />

          {/* ================= REVIEW ================= */}
          <Route path="review/:id" element={<ReviewPage />} />

        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;