import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Typography, Button, IconButton, Box,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Avatar, Tooltip, Chip, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon, TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon, BarChart as AnalyticsIcon,
  LocalFireDepartment as FireIcon, FormatQuote as QuoteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../context/AuthContext';

const MOTIVATIONAL_QUOTES = [
  "Small consistent actions lead to extraordinary results.",
  "The secret of getting ahead is getting started.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "The journey of a thousand miles begins with a single step.",
  "Either you run the day, or the day runs you.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Your future is created by what you do today, not tomorrow.",
  "Discipline is the bridge between goals and accomplishment.",
];

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ value, label, icon, gradient, glowColor }) {
  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          border: `1px solid ${glowColor}50`,
          boxShadow: `0 16px 48px ${glowColor}25`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '4px',
          background: gradient,
          borderRadius: '24px 24px 0 0',
        },
      }}
    >
      <Box
        sx={{
          width: 56, height: 56, borderRadius: '16px',
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 20px ${glowColor}40`,
          mb: 2.5,
          '& svg': { fontSize: 28, color: '#fff' },
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '2.6rem', color: '#F1F5F9', lineHeight: 1, mb: 0.8 }}>
        {value}
      </Typography>
      <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ─── Habit Card ─────────────────────────────────────────────────────────────
function HabitCard({ habit, onLog, onView, onDelete }) {
  const done = habit.lastCompletedDate
    && new Date(habit.lastCompletedDate).toDateString() === new Date().toDateString();

  const streakColor = habit.streakCount >= 7
    ? '#F59E0B'
    : habit.streakCount >= 3 ? '#818CF8' : '#64748B';

  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: done ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '22px',
        p: 3.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: done
            ? '0 20px 56px rgba(16,185,129,0.15)'
            : '0 20px 56px rgba(99,102,241,0.15)',
          border: done
            ? '1px solid rgba(16,185,129,0.55)'
            : '1px solid rgba(99,102,241,0.4)',
        },
        /* Left accent bar */
        '&::before': {
          content: '""',
          position: 'absolute', left: 0, top: 20, bottom: 20, width: '4px',
          background: done
            ? 'linear-gradient(to bottom, #10B981, #34D399)'
            : 'linear-gradient(to bottom, #6366F1, #8B5CF6)',
          borderRadius: '0 4px 4px 0',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, pl: 1.5 }}>
        <Box sx={{ flex: 1, pr: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#F1F5F9', lineHeight: 1.3, mb: 0.5 }}>
            {habit.name}
          </Typography>
          {habit.description && (
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              {habit.description}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="View details" arrow>
            <IconButton size="small" onClick={onView}
              sx={{ color: '#475569', p: 0.8, '&:hover': { color: '#818CF8', bgcolor: 'rgba(99,102,241,0.12)' } }}>
              <OpenInNewIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton size="small" onClick={onDelete}
              sx={{ color: '#475569', p: 0.8, '&:hover': { color: '#F87171', bgcolor: 'rgba(239,68,68,0.12)' } }}>
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Streak row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, pl: 1.5 }}>
        <FireIcon sx={{ fontSize: 22, color: streakColor }} />
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: streakColor }}>
          {habit.streakCount} day{habit.streakCount !== 1 ? 's' : ''} streak
        </Typography>
        {done && (
          <Chip
            label="✓ Done today"
            size="small"
            sx={{
              ml: 'auto',
              bgcolor: 'rgba(16,185,129,0.15)',
              color: '#34D399',
              border: '1px solid rgba(16,185,129,0.3)',
              fontWeight: 700,
              fontSize: '0.78rem',
              height: 26,
            }}
          />
        )}
      </Box>

      {/* Log button */}
      <Box sx={{ mt: 'auto', pl: 1.5 }}>
        <Button
          fullWidth variant={done ? 'outlined' : 'contained'} size="medium"
          startIcon={<CheckCircleIcon />}
          onClick={onLog}
          sx={{
            borderRadius: '12px',
            py: 1.2,
            fontWeight: 700,
            fontSize: '0.92rem',
            ...(done ? {
              borderColor: 'rgba(16,185,129,0.4)',
              color: '#34D399',
              background: 'rgba(16,185,129,0.08)',
              boxShadow: 'none',
              '&:hover': { borderColor: '#10B981', background: 'rgba(16,185,129,0.18)' },
            } : {}),
          }}
        >
          {done ? 'Log Again' : 'Log Today'}
        </Button>
      </Box>
    </Box>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { habits, loading, error, deleteHabit, logHabit } = useHabits();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [habitToLog, setHabitToLog] = useState(null);
  const [logNotes, setLogNotes] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const d = new Date();
    const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    setQuote(MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length]);
  }, []);

  const handleDeleteConfirm = async () => {
    try { await deleteHabit(habitToDelete._id); setDeleteDialogOpen(false); }
    catch (e) { console.error(e); }
  };
  const handleLogConfirm = async () => {
    try { await logHabit(habitToLog._id, logNotes); setLogDialogOpen(false); setLogNotes(''); }
    catch (e) { console.error(e); }
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(h =>
    h.lastCompletedDate && new Date(h.lastCompletedDate).toDateString() === new Date().toDateString()
  ).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streakCount), 0);
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={56} sx={{ color: '#6366F1', mb: 2 }} />
        <Typography sx={{ color: '#475569', fontSize: '1.1rem' }}>Loading your habits…</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,13,26,0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        px: { xs: 3, md: 6 },
        py: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '13px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
            }}>✦</Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#F1F5F9', letterSpacing: '-0.3px' }}>
              TrackWise
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/analytics')}
              sx={{
                borderColor: 'rgba(255,255,255,0.14)', color: '#94A3B8',
                borderRadius: '12px', px: 2.5, py: 1,
                fontSize: '0.95rem', fontWeight: 600,
                '&:hover': { borderColor: '#6366F1', color: '#818CF8', bgcolor: 'rgba(99,102,241,0.1)' },
              }}
            >
              Analytics
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/habits/new')}
              sx={{ borderRadius: '12px', px: 2.5, py: 1, fontSize: '0.95rem', fontWeight: 700 }}
            >
              New Habit
            </Button>
            <Tooltip title={`${user?.name} — Logout`} arrow>
              <Avatar
                onClick={() => { logout(); navigate('/login'); }}
                sx={{
                  width: 42, height: 42, cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  border: '2px solid rgba(99,102,241,0.45)',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'scale(1.08)', borderColor: '#818CF8' },
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 3, md: 6, xl: 10 }, py: 5 }}>

        {/* Welcome */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{
            fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' },
            color: '#F1F5F9', letterSpacing: '-0.5px', mb: 1.5, lineHeight: 1.2,
          }}>
            {greeting},{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {user?.name?.split(' ')[0]}
            </Box>
            {' '}👋
          </Typography>

          <Box sx={{
            display: 'inline-flex', alignItems: 'flex-start', gap: 1.2,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '14px', px: 2.5, py: 1.5, maxWidth: 600,
          }}>
            <QuoteIcon sx={{ color: '#6366F1', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
            <Typography sx={{ color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.6, fontSize: '1rem' }}>
              {quote}
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '14px' }}>{error}</Alert>}

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            { value: totalHabits, label: 'Total Habits', icon: <TrophyIcon />, gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)', glowColor: '#6366F1' },
            { value: `${completedToday} / ${totalHabits}`, label: 'Completed Today', icon: <CalendarIcon />, gradient: 'linear-gradient(135deg, #10B981, #34D399)', glowColor: '#10B981' },
            { value: `${longestStreak} days`, label: 'Longest Streak', icon: <FireIcon />, gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)', glowColor: '#F59E0B' },
            { value: `${completionRate}%`, label: "Today's Rate", icon: <TrendingUpIcon />, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)', glowColor: '#3B82F6' },
          ].map(s => (
            <Grid item xs={12} sm={6} lg={3} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* ── Progress bar ────────────────────────────────────────────── */}
        {totalHabits > 0 && (
          <Box sx={{
            mb: 5,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            p: 3.5,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#94A3B8' }}>
                Daily Progress
              </Typography>
              <Typography sx={{
                fontWeight: 800, fontSize: '1.1rem',
                color: completionRate === 100 ? '#34D399' : '#818CF8',
              }}>
                {completionRate === 100 ? '🎉 All done!' : `${completionRate}% complete`}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate" value={completionRate}
              sx={{
                height: 10, borderRadius: 5,
                bgcolor: 'rgba(255,255,255,0.07)',
                '& .MuiLinearProgress-bar': {
                  background: completionRate === 100
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                  borderRadius: 5,
                  transition: 'transform 0.8s ease',
                },
              }}
            />
          </Box>
        )}

        {/* ── Section header ──────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#F1F5F9' }}>
            Your Habits
            <Box component="span" sx={{
              ml: 1.5, px: 1.5, py: 0.4, borderRadius: '10px',
              background: 'rgba(99,102,241,0.18)', color: '#818CF8',
              fontSize: '0.9rem', fontWeight: 700, verticalAlign: 'middle',
            }}>
              {totalHabits}
            </Box>
          </Typography>
          {habits.length > 0 && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => navigate('/habits/new')}
              sx={{
                color: '#6366F1', fontWeight: 700, fontSize: '0.95rem',
                borderRadius: '12px', px: 2,
                '&:hover': { bgcolor: 'rgba(99,102,241,0.12)' },
              }}
            >
              Add habit
            </Button>
          )}
        </Box>

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {habits.length === 0 ? (
          <Box sx={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '24px',
            py: 12, px: 4,
            textAlign: 'center',
          }}>
            <Box sx={{
              width: 90, height: 90, borderRadius: '26px', mb: 4, mx: 'auto',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 46,
              boxShadow: '0 8px 32px rgba(99,102,241,0.2)',
            }}>🎯</Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', color: '#F1F5F9', mb: 1.5 }}>
              Start your first habit
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '1.05rem', mb: 5, maxWidth: 380, mx: 'auto', lineHeight: 1.7 }}>
              Track meaningful daily actions and watch your streaks grow over time.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/habits/new')}
              sx={{ borderRadius: '14px', px: 5, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
            >
              Create Your First Habit
            </Button>
          </Box>
        ) : (
          /* ── Habit Cards ─────────────────────────────────────────── */
          <Grid container spacing={3}>
            {habits.map(habit => (
              <Grid item xs={12} sm={6} lg={4} key={habit._id}>
                <HabitCard
                  habit={habit}
                  onLog={() => { setHabitToLog(habit); setLogDialogOpen(true); }}
                  onView={() => navigate(`/habits/${habit._id}/edit`)}
                  onDelete={() => { setHabitToDelete(habit); setDeleteDialogOpen(true); }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ── Delete Dialog ──────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#F1F5F9', fontSize: '1.2rem', pb: 1 }}>
          Delete Habit
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94A3B8', fontSize: '1rem' }}>
            Delete <Box component="span" sx={{ fontWeight: 700, color: '#F1F5F9' }}>"{habitToDelete?.name}"</Box>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#64748B', fontSize: '0.95rem' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained"
            sx={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.35)', fontSize: '0.95rem' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Log Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#F1F5F9', fontSize: '1.2rem', pb: 0.5 }}>
          Log ·{' '}
          <Box component="span" sx={{ background: 'linear-gradient(135deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {habitToLog?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', mb: 2.5 }}>
            Keep that streak alive 🔥 Add an optional note.
          </Typography>
          <TextField fullWidth label="Notes (optional)" multiline rows={3}
            value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="How did it go?" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => setLogDialogOpen(false)} sx={{ color: '#64748B', fontSize: '0.95rem' }}>Cancel</Button>
          <Button onClick={handleLogConfirm} variant="contained" sx={{ fontSize: '0.95rem' }}>Log Habit ✓</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;