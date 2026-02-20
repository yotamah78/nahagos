import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { HomePage } from './pages/shared/HomePage';
import { WelcomePage } from './pages/auth/WelcomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { NewRequestPage } from './pages/customer/NewRequestPage';
import { RequestDetailPage } from './pages/customer/RequestDetailPage';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { OnboardingPage } from './pages/driver/OnboardingPage';
import { JobDetailPage } from './pages/driver/JobDetailPage';
import { EarningsPage } from './pages/driver/EarningsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DriverApprovalPage } from './pages/admin/DriverApprovalPage';
import { JobsManagementPage } from './pages/admin/JobsManagementPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Home - redirects by role */}
          <Route path="/" element={<HomePage />} />

          {/* Customer routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <NewRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <RequestDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Driver routes */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/onboarding"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/job/:id"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <EarningsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DriverApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <JobsManagementPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center" dir="rtl">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-300">404</h1>
                <p className="text-gray-500 mt-2">הדף לא נמצא</p>
                <a href="/" className="text-primary-600 hover:underline mt-4 block">חזרה לדף הבית</a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
