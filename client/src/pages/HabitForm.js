import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Divider, InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Save as SaveIcon,
  Label as LabelIcon, Description as DescIcon,
  Repeat as RepeatIcon, AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useHabits } from '../hooks/useHabits';

function HabitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { habits, loading, createHabit, updateHabit } = useHabits();

  const [formData, setFormData] = useState({
    name: '', description: '', frequency: 'daily',
    reminderTime: '09:00',
    reminderDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && habits) {
      const habit = habits.find(h => h._id === id);
      if (habit) {
        setFormData({
          name: habit.name || '',
          description: habit.description || '',
          frequency: habit.frequency || 'daily',
          reminderTime: habit.reminderTime || '09:00',
          reminderDays: habit.reminderDays || [],
        });
      }
    }
  }, [isEditMode, id, habits]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError('Habit name is required'); return; }
    setFormError('');
    setSaving(true);
    try {
      if (isEditMode) await updateHabit(id, formData);
      else await createHabit(formData);
      navigate('/');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#6366F1' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', py: 4 }}>
      <Container maxWidth="sm">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}
          sx={{ mb: 3, color: '#64748B', borderRadius: '10px', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#94A3B8' } }}>
          Back to Dashboard
        </Button>

        {/* Card */}
        <Box sx={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Gradient Header */}
          <Box sx={{
            px: 4, py: 3.5,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.25) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'relative', overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute',
              top: '-50px', right: '-50px', width: '200px', height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{
                width: 48, height: 48, borderRadius: '14px', mb: 2,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
              }}>
                {isEditMode ? '✏️' : '🎯'}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.3px' }}>
                {isEditMode ? 'Edit Habit' : 'Create New Habit'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.6)', mt: 0.5 }}>
                {isEditMode ? 'Update your habit details below' : 'Define a habit you want to build consistently'}
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box sx={{ p: 4 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 3, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                {formError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField fullWidth required label="Habit Name" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="e.g. Morning meditation"
                InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment> }} />

              <TextField fullWidth label="Description (optional)" name="description"
                value={formData.description} onChange={handleChange}
                multiline rows={3} placeholder="Why does this habit matter to you?"
                InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment> }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select name="frequency" value={formData.frequency} onChange={handleChange} label="Frequency"
                    startAdornment={<InputAdornment position="start"><RepeatIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment>}>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>

                <TextField fullWidth label="Reminder Time" name="reminderTime" type="time"
                  value={formData.reminderTime} onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><TimeIcon sx={{ color: '#6366F1', fontSize: 20 }} /></InputAdornment> }} />
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 0.5 }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button fullWidth variant="outlined" onClick={() => navigate('/')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.1)', color: '#64748B', borderRadius: '12px',
                    '&:hover': { borderColor: '#475569', bgcolor: 'rgba(255,255,255,0.04)' }, boxShadow: 'none'
                  }}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth variant="contained" disabled={saving}
                  endIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon sx={{ fontSize: 18 }} />}
                  sx={{ py: 1.3, borderRadius: '12px', fontWeight: 700 }}>
                  {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Habit'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HabitForm;