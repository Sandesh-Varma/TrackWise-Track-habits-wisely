import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Grid, CircularProgress,
  Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import api from '../utils/api';

const GRADIENT_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6'];

const customTooltip = {
  contentStyle: {
    background: 'rgba(15,15,30,0.95)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    fontSize: 13, color: '#F1F5F9',
    backdropFilter: 'blur(20px)',
  },
  labelStyle: { color: '#818CF8', fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: '#94A3B8' },
  cursor: { stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 },
};

function ChartCard({ title, subtitle, children }) {
  return (
    <Box sx={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', p: 3,
      height: '100%',
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: 'rgba(99,102,241,0.25)' },
    }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9' }}>{title}</Typography>
        {subtitle && <Typography variant="caption" sx={{ color: '#475569' }}>{subtitle}</Typography>}
      </Box>
      {children}
    </Box>
  );
}

const CustomDot = (props) => {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#6366F1" stroke="rgba(99,102,241,0.3)" strokeWidth={6} />;
};

function Analytics() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState('');

  useEffect(() => {
    api.get('/api/analytics')
      .then(r => {
        setAnalyticsData(r.data);
        if (r.data.habitCompletions?.length > 0) setSelectedHabit(r.data.habitCompletions[0].habitId);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={48} sx={{ color: '#6366F1', mb: 2 }} />
        <Typography sx={{ color: '#475569' }}>Crunching your data…</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D0D1A', py: 4 }}>
      <Container maxWidth="xl">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}
          sx={{ mb: 3, color: '#64748B', borderRadius: '10px', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#94A3B8' } }}>
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', mb: 0.5 }}>
            Analytics &{' '}
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Insights
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Your habit performance, visualised in full detail
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>{error}</Alert>}

        {(!analyticsData || (analyticsData.overallProgress?.length === 0 && analyticsData.habitCompletions?.length === 0)) ? (
          <Box sx={{
            background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '20px', p: 8, textAlign: 'center',
          }}>
            <Typography sx={{ fontSize: 44, mb: 2 }}>📊</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>No data yet</Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>Start logging your habits to unlock insights.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* defs for SVG gradients */}
            <Box component="svg" sx={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
            </Box>

            {/* Overall Area Chart */}
            {analyticsData.overallProgress?.length > 0 && (
              <Grid item xs={12}>
                <ChartCard title="Overall Completions" subtitle="All habits combined over time">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={analyticsData.overallProgress}>
                      <defs>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                      <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                      <Tooltip {...customTooltip} />
                      <Area type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2.5}
                        fill="url(#areaFill)" dot={<CustomDot />} activeDot={{ r: 7, fill: '#818CF8', stroke: 'rgba(99,102,241,0.4)', strokeWidth: 8 }}
                        name="Completions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>
            )}

            {/* Donut Chart */}
            {analyticsData.habitCompletions?.length > 0 && (() => {
              const totalCompletions = analyticsData.habitCompletions
                .map(h => ({ name: h.name, value: h.data.reduce((s, e) => s + e.count, 0) }))
                .filter(h => h.value > 0);
              return totalCompletions.length > 0 ? (
                <Grid item xs={12} md={5}>
                  <ChartCard title="Habit Breakdown" subtitle="Completion share per habit">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={totalCompletions} cx="50%" cy="50%" innerRadius={65} outerRadius={105}
                          paddingAngle={4} dataKey="value" nameKey="name">
                          {totalCompletions.map((_, i) => (
                            <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]}
                              stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip {...customTooltip} />
                        <Legend
                          iconType="circle" iconSize={8}
                          formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 13 }}>{v}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>
              ) : null;
            })()}

            {/* Bar Chart per Habit */}
            {analyticsData.habitCompletions?.length > 0 && (
              <Grid item xs={12} md={7}>
                <ChartCard title="Individual Progress" subtitle="Select a habit to inspect">
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel>Select Habit</InputLabel>
                    <Select value={selectedHabit} onChange={e => setSelectedHabit(e.target.value)} label="Select Habit">
                      {analyticsData.habitCompletions.map(h => (
                        <MenuItem key={h.habitId} value={h.habitId}>{h.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {(() => {
                    const data = analyticsData.habitCompletions.find(h => h.habitId === selectedHabit)?.data || [];
                    return data.length > 0 ? (
                      <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={data}>
                          <defs>
                            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#6366F1" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                          <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                          <Tooltip {...customTooltip} />
                          <Bar dataKey="count" fill="url(#barFill)" name="Completions" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" sx={{ color: '#475569' }}>No data for this habit yet.</Typography>
                      </Box>
                    );
                  })()}
                </ChartCard>
              </Grid>
            )}

            {/* Streak Area Chart */}
            {analyticsData.streakHistory?.length > 0 && (
              <Grid item xs={12}>
                <ChartCard title="Streak Timeline" subtitle="Watch your momentum grow">
                  <FormControl size="small" sx={{ mb: 2.5, minWidth: 220 }}>
                    <InputLabel>Select Habit</InputLabel>
                    <Select value={selectedHabit} onChange={e => setSelectedHabit(e.target.value)} label="Select Habit">
                      {analyticsData.streakHistory.map(h => (
                        <MenuItem key={h.habitId} value={h.habitId}>{h.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {(() => {
                    const data = analyticsData.streakHistory.find(h => h.habitId === selectedHabit)?.data || [];
                    return data.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id="streakFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                          <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                          <Tooltip {...customTooltip} />
                          <Area type="monotone" dataKey="streak" stroke="#F59E0B" strokeWidth={2.5}
                            fill="url(#streakFill)"
                            dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 7, fill: '#FCD34D', stroke: 'rgba(245,158,11,0.4)', strokeWidth: 8 }}
                            name="Streak" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" sx={{ color: '#475569' }}>No streak data yet.</Typography>
                      </Box>
                    );
                  })()}
                </ChartCard>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Analytics;