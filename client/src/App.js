import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HabitForm from './pages/HabitForm';
import HabitDetails from './pages/HabitDetails';
import Analytics from './pages/Analytics';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    success: { main: '#10B981', light: '#34D399', dark: '#059669' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    error: { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
    background: {
      default: '#0D0D1A',
      paper: 'rgba(255,255,255,0.05)',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    htmlFontSize: 18,
    fontSize: 18,
    h1: { fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontWeight: 800, letterSpacing: '-0.5px' },
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700, letterSpacing: '-0.3px', fontSize: '2rem' },
    h5: { fontWeight: 700, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.2rem' },
    subtitle1: { fontSize: '1.05rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.95rem', fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em', fontSize: '0.95rem' },
    body1: { lineHeight: 1.7, fontSize: '1rem' },
    body2: { lineHeight: 1.6, fontSize: '0.9rem' },
    caption: { fontSize: '0.8rem' },
    overline: { fontSize: '0.75rem' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 6px 28px rgba(99,102,241,0.55)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.15)',
          '&:hover': {
            borderColor: '#6366F1',
            background: 'rgba(99,102,241,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
              boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
            },
          },
          '& .MuiInputLabel-root': { color: '#94A3B8' },
          '& .MuiOutlinedInput-input': { color: '#F1F5F9' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(20,20,40,0.95)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { background: 'rgba(99,102,241,0.15)' },
          '&.Mui-selected': { background: 'rgba(99,102,241,0.2)' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.08)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, backdropFilter: 'blur(12px)' },
      },
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/habits/new" element={<ProtectedRoute><HabitForm /></ProtectedRoute>} />
            <Route path="/habits/:id/edit" element={<ProtectedRoute><HabitForm /></ProtectedRoute>} />
            <Route path="/habits/:id" element={<ProtectedRoute><HabitDetails /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;