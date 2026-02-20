import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, Link,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔥', title: 'Streak Tracking', desc: 'Build unstoppable momentum day by day' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Visualize your progress with rich charts' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss a habit with timely nudges' },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0D0D1A' }}>
      {/* Left Hero Panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(16,185,129,0.1) 100%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            top: '-100px',
            left: '-100px',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
            }}>✦</Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px' }}>
              TrackWise
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            fontWeight: 800, color: '#F1F5F9', lineHeight: 1.1, mb: 2,
            fontSize: { md: '2.8rem', lg: '3.5rem' },
          }}>
            Build habits that{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              actually stick
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 6, maxWidth: 380, fontSize: '1.1rem', lineHeight: 1.7 }}>
            Join thousands building powerful daily routines with science-backed streak mechanics.
          </Typography>

          {/* Feature chips */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {features.map((f) => (
              <Box key={f.title} sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', px: 2.5, py: 1.8,
                transition: 'all 0.2s',
                '&:hover': { background: 'rgba(255,255,255,0.09)', borderColor: 'rgba(99,102,241,0.4)' },
              }}>
                <Box sx={{ fontSize: 24, lineHeight: 1 }}>{f.icon}</Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>{f.title}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>{f.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Decorative circle */}
        <Box sx={{
          position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', zIndex: 0,
        }} />
      </Box>

      {/* Right Form Panel */}
      <Box sx={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        px: { xs: 3, sm: 6, md: 8 },
        position: 'relative',
        '&::before': {
          content: '""', position: 'absolute', left: 0, top: '10%', bottom: '10%',
          width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
          display: { xs: 'none', md: 'block' },
        },
      }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 5, justifyContent: 'center' }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>✦</Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#F1F5F9' }}>TrackWise</Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 0.5, letterSpacing: '-0.5px' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
            Sign in to continue your journey
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required fullWidth label="Email Address" name="email"
              autoComplete="email" autoFocus
              value={formData.email} onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password} onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#64748B' }}>
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
              sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{
                color: '#818CF8', fontWeight: 700, textDecoration: 'none',
                '&:hover': { textDecoration: 'underline', color: '#A78BFA' },
              }}>
                Create one free →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;