import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, Link,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import {
  Person as PersonIcon, Email as EmailIcon, Lock as LockIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (formData.password !== formData.confirmPassword) { setFormError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setFormError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0D0D1A' }}>
      {/* Left Hero Panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '45%', flexDirection: 'column', justifyContent: 'center',
        px: 8, position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.12) 100%)',
          zIndex: 0,
        },
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
            }}>✦</Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1F5F9' }}>TrackWise</Typography>
          </Box>

          <Typography variant="h3" sx={{
            fontWeight: 800, color: '#F1F5F9', lineHeight: 1.15, mb: 2,
          }}>
            Your journey to{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              better habits
            </Box>{' '}starts here
          </Typography>

          <Typography sx={{ color: '#64748B', lineHeight: 1.7, maxWidth: 340, fontSize: '1rem' }}>
            Create your free account and begin tracking the habits that matter most to you.
          </Typography>

          {/* Stats row */}
          <Box sx={{ display: 'flex', gap: 3, mt: 6 }}>
            {[{ val: '10K+', label: 'Active Users' }, { val: '500K+', label: 'Habits Tracked' }, { val: '98%', label: 'Satisfaction' }].map(s => (
              <Box key={s.label}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {s.val}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        }} />
      </Box>

      {/* Right Form */}
      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        px: { xs: 3, sm: 6, md: 8 },
        '&::before': {
          content: '""', position: 'absolute', left: '45%', top: '10%', bottom: '10%',
          width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
          display: { xs: 'none', md: 'block' },
        },
      }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 5, justifyContent: 'center' }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>✦</Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#F1F5F9' }}>TrackWise</Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 0.5, letterSpacing: '-0.5px' }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
            Free forever. No credit card required.
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField required fullWidth label="Full Name" name="name" autoFocus
              value={formData.name} onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment> }} />

            <TextField required fullWidth label="Email Address" name="email" autoComplete="email"
              value={formData.email} onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment> }} />

            <TextField required fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              value={formData.password} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#64748B' }}>
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />

            <TextField required fullWidth label="Confirm Password" name="confirmPassword"
              type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
              value={formData.confirmPassword} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small" sx={{ color: '#64748B' }}>
                      {showConfirm ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />

            <Button type="submit" fullWidth variant="contained" disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
              sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}>
              {loading ? 'Creating Account…' : 'Get Started Free'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#818CF8', fontWeight: 700, textDecoration: 'none', '&:hover': { color: '#A78BFA' } }}>
                Sign in →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;