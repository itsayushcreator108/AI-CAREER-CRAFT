import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  Users, 
  Calendar,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Code,
  Clock,
  Award,
  Zap,
  FileText,
  TrendingDown
} from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const Progress = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [animateCharts, setAnimateCharts] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real data from API
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSubmissions: 0,
    languageDistribution: [],
    monthlyTrends: [],
    recentActivity: [],
    performanceMetrics: {}
  });

  const backendUrl = 'http://localhost:4000';

  // Fetch user history from backend
  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${backendUrl}/api/codequest/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const userSubmissions = response.data.submissions || [];
          setSubmissions(userSubmissions);
          
          // Process data for analytics
          const processedAnalytics = processSubmissionData(userSubmissions);
          setAnalytics(processedAnalytics);
          
          // Calculate overall progress
          const totalProgress = Math.min(100, (userSubmissions.length / 10) * 100); // 10 submissions = 100%
          setProgress(totalProgress);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load your coding progress");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [getToken]);

  // Process submission data for analytics
  const processSubmissionData = (submissions) => {
    if (!submissions.length) {
      return {
        totalSubmissions: 0,
        languageDistribution: [],
        monthlyTrends: [],
        recentActivity: [],
        performanceMetrics: {}
      };
    }

    // Language distribution
    const languageCounts = {};
    const colors = {
      'JavaScript': '#F7DF1E',
      'Python': '#3776AB',
      'Python3': '#3776AB',
      'Java': '#ED8B00',
      'C++': '#00599C',
      'C': '#A8B9CC',
      'C#': '#239120',
      'Ruby': '#CC342D',
      'Swift': '#FA7343',
      'Go': '#00ADD8',
      'Rust': '#000000',
      'PHP': '#777BB4',
      'Kotlin': '#7F52FF',
      'Scala': '#DC322F'
    };

    submissions.forEach(sub => {
      languageCounts[sub.language] = (languageCounts[sub.language] || 0) + 1;
    });

    const languageDistribution = Object.entries(languageCounts)
      .map(([language, count]) => ({
        label: language,
        value: Math.round((count / submissions.length) * 100),
        count: count,
        color: colors[language] || '#8B5CF6'
      }))
      .sort((a, b) => b.count - a.count);

    // Monthly trends (last 6 months)
    const monthlyData = {};
    const now = new Date();
    
    submissions.forEach(sub => {
      const date = new Date(sub.submittedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const monthlyTrends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        count
      }));

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const recentActivity = submissions
      .filter(sub => new Date(sub.submittedAt) >= sevenDaysAgo)
      .length;

    // Performance metrics
    const avgSubmissionsPerMonth = submissions.length > 0 
      ? Math.round((submissions.length / Math.max(1, monthlyTrends.length)) * 10) / 10 
      : 0;
    
    const mostUsedLanguage = languageDistribution[0]?.label || 'N/A';
    const diversityScore = Math.min(100, languageDistribution.length * 15); // More languages = higher score

    return {
      totalSubmissions: submissions.length,
      languageDistribution,
      monthlyTrends,
      recentActivity,
      performanceMetrics: {
        avgSubmissionsPerMonth,
        mostUsedLanguage,
        diversityScore,
        consistencyScore: Math.min(100, recentActivity * 14) // Based on recent activity
      }
    };
  };

  // Animated counter hook
  useEffect(() => {
    if (animateCharts && !loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const targetProgress = Math.min(100, (submissions.length / 10) * 100);
          if (prev < targetProgress) {
            return Math.min(prev + 2, targetProgress);
          }
          return targetProgress;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [animateCharts, loading, submissions.length]);

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#8B5CF6" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <span className="absolute text-xl font-bold text-white">
          {Math.round(percentage)}%
        </span>
      </div>
    );
  };

  // Enhanced Pie Chart Component
  const PieChartComponent = ({ data, size = 200 }) => {
    if (!data.length) return <div className="text-gray-400 text-center">No data available</div>;
    
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="drop-shadow-lg">
          {data.map((item, index) => {
            const angle = (item.count / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = size / 2 + (size / 2 - 20) * Math.cos((startAngle * Math.PI) / 180);
            const y1 = size / 2 + (size / 2 - 20) * Math.sin((startAngle * Math.PI) / 180);
            const x2 = size / 2 + (size / 2 - 20) * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = size / 2 + (size / 2 - 20) * Math.sin(((startAngle + angle) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <g key={index}>
                <path
                  d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2 - 20} ${size / 2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                  }}
                />
              </g>
            );
          })}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={30}
            fill="rgb(17 24 39)"
            className="drop-shadow-md"
          />
        </svg>
      </div>
    );
  };

  // Submission Trends Chart
  const TrendsChart = ({ data }) => {
    if (!data.length) return <div className="text-gray-400 text-center">No trend data available</div>;
    
    const maxCount = Math.max(...data.map(d => d.count));
    const chartHeight = 200;
    const chartWidth = 400;
    const padding = 40;

    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={percent}
              x1={padding}
              y1={padding + (chartHeight - 2 * padding) * (1 - percent / 100)}
              x2={chartWidth - padding}
              y2={padding + (chartHeight - 2 * padding) * (1 - percent / 100)}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Data line */}
          <polyline
            points={data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
              const y = padding + (chartHeight - 2 * padding) * (1 - d.count / maxCount);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
            const y = padding + (chartHeight - 2 * padding) * (1 - d.count / maxCount);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#8B5CF6"
                className="hover:r-6 transition-all cursor-pointer"
              />
            );
          })}

          {/* Labels */}
          {data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 10}
                fill="#9CA3AF"
                fontSize="12"
                textAnchor="middle"
              >
                {d.month}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'languages', label: 'Languages', icon: Code },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-4 animate-pulse">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Loading your coding progress...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing your submissions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-2xl mb-4">
            <TrendingDown className="w-8 h-8 text-white" />
          </div>
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CodeQuest Progress
            </h1>
            <p className="text-gray-400 mt-2">
              Your coding journey insights • {analytics.totalSubmissions} submissions tracked
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Recent Activity</div>
              <div className="text-2xl font-bold text-green-400">{analytics.recentActivity}</div>
              <div className="text-xs text-gray-500">Last 7 days</div>
            </div>
            <button
              onClick={() => setAnimateCharts(!animateCharts)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                animateCharts 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {animateCharts ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {animateCharts ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Main Progress Circle */}
            <div className="xl:col-span-1 bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Coding Progress</h3>
                <CircularProgress percentage={progress} size={150} />
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Submissions</span>
                    <span className="font-bold text-green-400">{analytics.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Languages Used</span>
                    <span className="font-bold text-blue-400">{analytics.languageDistribution.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Most Used</span>
                    <span className="font-bold text-purple-400">{analytics.performanceMetrics.mostUsedLanguage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Distribution */}
            <div className="xl:col-span-1 bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4">Language Distribution</h3>
              <div className="flex items-center justify-center mb-4">
                <PieChartComponent data={analytics.languageDistribution} size={180} />
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {analytics.languageDistribution.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{item.count}</span>
                      <span className="text-sm font-semibold">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="xl:col-span-1 grid grid-cols-1 gap-4">
              {[
                { 
                  label: 'Diversity Score', 
                  value: `${analytics.performanceMetrics.diversityScore}%`, 
                  icon: Target, 
                  color: 'text-blue-400', 
                  description: 'Language variety'
                },
                { 
                  label: 'Consistency', 
                  value: `${analytics.performanceMetrics.consistencyScore}%`, 
                  icon: Clock, 
                  color: 'text-green-400', 
                  description: 'Recent activity'
                },
                { 
                  label: 'Monthly Avg', 
                  value: analytics.performanceMetrics.avgSubmissionsPerMonth, 
                  icon: Calendar, 
                  color: 'text-purple-400', 
                  description: 'Submissions/month'
                },
                { 
                  label: 'This Week', 
                  value: analytics.recentActivity, 
                  icon: Zap, 
                  color: 'text-yellow-400', 
                  description: 'Recent submissions'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-xs ${stat.color} font-medium`}>{stat.description}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="xl:col-span-3 bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
              {submissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissions.slice(0, 6).map((submission, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-400">{submission.language}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate mb-2">
                        {typeof submission.question === 'string' 
                          ? submission.question.slice(0, 60) + '...'
                          : 'Coding Problem'
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {submission.code.length} characters
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No submissions yet</p>
                  <p className="text-sm text-gray-500">Start coding to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'languages' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-6">Language Usage</h3>
              <div className="space-y-4">
                {analytics.languageDistribution.map((lang, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{lang.count} submissions</span>
                        <span className="text-sm font-semibold">{lang.value}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${lang.value}%`, 
                          backgroundColor: lang.color,
                          boxShadow: `0 0 10px ${lang.color}40`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4">Language Insights</h3>
              <div className="flex items-center justify-center mb-6">
                <PieChartComponent data={analytics.languageDistribution} size={200} />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{analytics.languageDistribution.length}</div>
                  <div className="text-sm text-gray-400">Different languages used</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4">Submission Trends</h3>
              <TrendsChart data={analytics.monthlyTrends} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
                <div className="text-sm text-gray-400">Total Submissions</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.performanceMetrics.avgSubmissionsPerMonth}</div>
                <div className="text-sm text-gray-400">Monthly Average</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.recentActivity}</div>
                <div className="text-sm text-gray-400">This Week</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { 
                label: 'Consistency Score', 
                value: analytics.performanceMetrics.consistencyScore, 
                color: '#10B981',
                description: 'Based on regular submissions'
              },
              { 
                label: 'Diversity Score', 
                value: analytics.performanceMetrics.diversityScore, 
                color: '#8B5CF6',
                description: 'Language variety bonus'
              },
              { 
                label: 'Activity Score', 
                value: Math.min(100, analytics.recentActivity * 20), 
                color: '#F59E0B',
                description: 'Recent engagement level'
              }
            ].map((metric, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
                <h3 className="text-lg font-semibold mb-4">{metric.label}</h3>
                <CircularProgress 
                  percentage={metric.value} 
                  size={120} 
                  color={metric.color}
                />
                <div className="mt-4 text-sm text-gray-400">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;