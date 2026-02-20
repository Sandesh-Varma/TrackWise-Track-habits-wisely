import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Grid, CircularProgress,
  Alert, List, ListItem, ListItemText, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon, LocalFireDepartment as FireIcon,
  EditNote as EditNoteIcon, AccessTime as ClockIcon,
  CalendarToday as CalIcon, Edit as EditIcon,
} from '@mui/icons-material';
import { useHabits } from '../hooks/useHabits';
import api from '../utils/api';

function HabitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, loading, error, deleteHabit, logHabit } = useHabits();
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logNotes, setLogNotes] = useState('');
  const habit = habits?.find(h => h._id === id);

  useEffect(() => {
    if (!id) return;
    api.get(`/logs/habit/${id}`)
      .then(r => setLogs(r.data))
      .catch(() => { })
      .finally(() => setLogsLoading(false));
  }, [id]);

  const handleLogConfirm = async () => {
    try {
      await logHabit(id, logNotes);
      setLogDialogOpen(false); setLogNotes('');
      const r = await api.get(`/logs/habit/${id}`);
      setLogs(r.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this habit? This cannot be undone.')) {
      try { await deleteHabit(id); navigate('/'); }
      catch (err) { console.error(err); }
    }
  };

  if (loading || logsLoading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#6366F1' }} />
    </Box>
  );

  if (!habit) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', p: 4 }}>
      <Container><Alert severity="warning">Habit not found</Alert></Container>
    </Box>
  );

  const statItems = [
    { icon: <FireIcon />, label: 'Day Streak', value: `${habit.streakCount}`, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
    { icon: <RepeatIcon />, label: 'Frequency', value: habit.frequency, color: '#818CF8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
    { icon: <ClockIcon />, label: 'Reminder', value: habit.reminderTime || '—', color: '#34D399', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
    { icon: <CalIcon />, label: 'Total Logs', value: logs.length, color: '#60A5FA', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}
          sx={{ mb: 3, color: '#64748B', borderRadius: '10px', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#94A3B8' } }}>
          Back to Dashboard
        </Button>

        {/* Hero Card */}
        <Box sx={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
          overflow: 'hidden', boxShadow: '0 16px 64px rgba(0,0,0,0.4)', mb: 3,
        }}>
          {/* Header Gradient */}
          <Box sx={{
            px: 4, py: 3.5,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{
              position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
            }} />
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'rgba(241,245,249,0.5)', letterSpacing: '2px', fontSize: '0.7rem' }}>
                  HABIT DETAILS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', mt: 0.5, mb: 0.5 }}>
                  {habit.name}
                </Typography>
                {habit.description && (
                  <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.6)', maxWidth: 480 }}>
                    {habit.description}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
                <Button size="small" startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                  onClick={() => navigate(`/habits/${id}/edit`)}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '10px', border: '1px solid', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, fontSize: '0.8rem' }}>
                  Edit
                </Button>
                <Button size="small" startIcon={<DeleteIcon sx={{ fontSize: 15 }} />}
                  onClick={handleDelete}
                  sx={{ borderColor: 'rgba(239,68,68,0.3)', color: '#F87171', borderRadius: '10px', border: '1px solid', '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' }, fontSize: '0.8rem' }}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ px: 4, py: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {statItems.map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Box sx={{
                    background: s.bg, border: `1px solid ${s.border}`,
                    borderRadius: '14px', p: 2, textAlign: 'center',
                  }}>
                    <Box sx={{ color: s.color, mb: 0.5, '& svg': { fontSize: 22 } }}>{s.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#F1F5F9', lineHeight: 1, textTransform: 'capitalize' }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>{s.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button variant="contained" startIcon={<CheckCircleIcon />}
              onClick={() => setLogDialogOpen(true)}
              sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 700 }}>
              Log Today's Completion
            </Button>
          </Box>
        </Box>

        {/* Logs Card */}
        <Box sx={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9' }}>Completion History</Typography>
            <Chip label={logs.length} size="small" sx={{
              bgcolor: 'rgba(99,102,241,0.15)', color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.3)', fontWeight: 700, fontSize: '0.75rem',
            }} />
          </Box>

          {logs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: 40, mb: 1 }}>📋</Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                No logs yet. Start tracking your progress!
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {logs.map((log, index) => (
                <React.Fragment key={log._id}>
                  <ListItem disablePadding sx={{ py: 1.5, px: 0 }}>
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%', mr: 2, flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.5)',
                    }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                          {new Date(log.date || log.completedAt).toLocaleDateString('en-US', {
                            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </Typography>
                      }
                      secondary={log.notes && (
                        <Typography variant="caption" sx={{ color: '#475569', fontStyle: 'italic' }}>
                          "{log.notes}"
                        </Typography>
                      )}
                    />
                    <Box sx={{
                      width: 28, height: 28, borderRadius: '50%',
                      bgcolor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#34D399' }} />
                    </Box>
                  </ListItem>
                  {index < logs.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Container>

      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#F1F5F9', pb: 0.5 }}>
          Log · <Box component="span" sx={{ background: 'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{habit.name}</Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2.5 }}>
            Nice work! Keep the streak alive 🔥
          </Typography>
          <TextField fullWidth label="Notes (optional)" multiline rows={3} value={logNotes}
            onChange={e => setLogNotes(e.target.value)} placeholder="How did it go?" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setLogDialogOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button onClick={handleLogConfirm} variant="contained">Log Habit ✓</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Missing import fix
function RepeatIcon(props) {
  return <EditNoteIcon {...props} />;
}

export default HabitDetails;