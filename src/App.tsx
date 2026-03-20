import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Fleet from './pages/public/Fleet';
import Destinations from './pages/public/Destinations';
import Blog from './pages/public/Blog';
import Gallery from './pages/public/Gallery';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import FleetManagement from './pages/admin/FleetManagement';
import RoutePricing from './pages/admin/RoutePricing';
import Operations from './pages/admin/Operations';
import Finance from './pages/admin/Finance';
import CMS from './pages/admin/CMS';
import Settings from './pages/admin/Settings';
import Login from './pages/admin/Login';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="armada" element={<Fleet />} />
            <Route path="destinasi" element={<Destinations />} />
            <Route path="blog" element={<Blog />} />
            <Route path="galeri" element={<Gallery />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="armada" element={<FleetManagement />} />
            <Route path="rute" element={<RoutePricing />} />
            <Route path="operasional" element={<Operations />} />
            <Route path="keuangan" element={<Finance />} />
            <Route path="cms" element={<CMS />} />
            <Route path="pengaturan" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
