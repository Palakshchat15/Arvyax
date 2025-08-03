
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { MySessions } from './pages/MySessions';
import { SessionEditor } from './pages/SessionEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/my-sessions" 
              element={
                <ProtectedRoute>
                  <MySessions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/session-editor/:id?" 
              element={
                <ProtectedRoute>
                  <SessionEditor />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;