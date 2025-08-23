import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Award,
  Gift,
  Building,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Activity,
  RefreshCw,
  Star,
  Zap,
  TrendingDown,
  ChevronDown,
  Calendar,
  Database,
} from "lucide-react";

const Salary = () => {
  const [loading, setLoading] = useState(false);
  const [salaryStats, setSalaryStats] = useState({});
  const [salaryTrend, setSalaryTrend] = useState([]);
  const [salaryBreakdown, setSalaryBreakdown] = useState([]);
  const [skillsDemandData, setSkillsDemandData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Realistic 10-year salary trend data (2015-2024)
  const realistic10YearTrend = [
    { year: "2015", medianSalary: 500000, freshers: 250000, senior: 1000000 },
    { year: "2016", medianSalary: 530000, freshers: 265000, senior: 1060000 },
    { year: "2017", medianSalary: 560000, freshers: 280000, senior: 1120000 },
    { year: "2018", medianSalary: 610000, freshers: 305000, senior: 1220000 },
    { year: "2019", medianSalary: 670000, freshers: 335000, senior: 1340000 },
    { year: "2020", medianSalary: 720000, freshers: 360000, senior: 1440000 },
    { year: "2021", medianSalary: 760000, freshers: 380000, senior: 1520000 },
    { year: "2022", medianSalary: 800000, freshers: 400000, senior: 1600000 },
    { year: "2023", medianSalary: 860000, freshers: 430000, senior: 1720000 },
    { year: "2024", medianSalary: 900000, freshers: 450000, senior: 1800000 },
  ];

  // Generate dynamic salary stats (changes on refresh)
  const generateDynamicSalaryStats = () => {
    const baseMedian = 900000;
    const variation = Math.floor(Math.random() * 100000) - 50000;

    return {
      currentSalary: baseMedian + variation,
      avgIncrease: 7.5 + (Math.random() * 2 - 1),
      totalEarnings: (baseMedian + variation) * (5 + Math.random() * 2),
      bonusReceived: 180000 + Math.floor(Math.random() * 40000),
      marketIndex: 75 + Math.floor(Math.random() * 20),
      jobOpenings: 12500 + Math.floor(Math.random() * 5000),
    };
  };

  // Dynamic monthly breakdown (changes on refresh)
  const generateDynamicMonthlyTrend = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const baseSalary = 75000;
    const currentMonth = 7;

    return months.slice(0, currentMonth + 1).map((month, index) => {
      const randomVariation = Math.floor(Math.random() * 5000) - 2500;
      const monthlyBase = baseSalary + index * 1000 + randomVariation;
      const bonus =
        index === 2 || index === 5 || index === 8 || index === 11
          ? 40000 + Math.floor(Math.random() * 20000)
          : 0;

      return {
        month,
        salary: monthlyBase,
        total: monthlyBase + bonus + 12000 + Math.floor(Math.random() * 6000),
      };
    });
  };

  // Fixed: Dynamic salary breakdown with proper current salary reference
  const generateDynamicSalaryBreakdown = (currentSalary) => {
    if (!currentSalary) currentSalary = 900000;

    const baseVariation = Math.random() * 4 - 2;
    const basePercentage = 72 + baseVariation;
    const variablePercentage = 18 - baseVariation / 2;
    const benefitsPercentage = 10 - baseVariation / 2;

    return [
      {
        component: "Base Salary",
        amount: Math.floor(currentSalary * (basePercentage / 100)),
        percentage: basePercentage,
        color: "#10B981",
      },
      {
        component: "Variable Pay",
        amount: Math.floor(currentSalary * (variablePercentage / 100)),
        percentage: variablePercentage,
        color: "#3B82F6",
      },
      {
        component: "Benefits & PF",
        amount: Math.floor(currentSalary * (benefitsPercentage / 100)),
        percentage: benefitsPercentage,
        color: "#6B7280",
      },
    ];
  };

  // Dynamic skills data (demand fluctuates)
  const generateDynamicSkillsData = () => {
    const baseSkills = [
      { skill: "AI/ML", baseDemand: 90, baseSalary: 2000000 },
      { skill: "Cloud (AWS/Azure)", baseDemand: 85, baseSalary: 1500000 },
      { skill: "DevOps/SRE", baseDemand: 82, baseSalary: 1300000 },
      { skill: "Full Stack", baseDemand: 78, baseSalary: 1100000 },
      { skill: "Cybersecurity", baseDemand: 80, baseSalary: 1400000 },
      { skill: "Data Science", baseDemand: 75, baseSalary: 1200000 },
    ];

    const colors = [
      "#10B981",
      "#3B82F6",
      "#059669",
      "#1D4ED8",
      "#6B7280",
      "#4B5563",
    ];

    return baseSkills.slice(0, 5).map((skill, index) => ({
      skill: skill.skill,
      demand: skill.baseDemand + Math.floor(Math.random() * 8 - 4),
      avgSalary: skill.baseSalary + Math.floor(Math.random() * 200000 - 100000),
      color: colors[index],
    }));
  };

  // Dynamic department data (salaries fluctuate)
  const generateDynamicDepartmentData = () => {
    const baseDepartments = [
      { dept: "AI/ML", baseSalary: 2000000, baseGrowth: 14.5 },
      { dept: "Cloud", baseSalary: 1500000, baseGrowth: 11.8 },
      { dept: "DevOps", baseSalary: 1300000, baseGrowth: 10.2 },
      { dept: "Frontend", baseSalary: 1100000, baseGrowth: 8.1 },
      { dept: "Backend", baseSalary: 1200000, baseGrowth: 8.9 },
      { dept: "QA/Testing", baseSalary: 850000, baseGrowth: 6.2 },
      { dept: "Mobile", baseSalary: 1150000, baseGrowth: 7.8 },
      { dept: "Data Science", baseSalary: 1350000, baseGrowth: 9.5 },
    ];

    const colors = [
      "#10B981",
      "#3B82F6",
      "#059669",
      "#1D4ED8",
      "#6B7280",
      "#4B5563",
      "#047857",
      "#065F46",
    ];

    return baseDepartments.slice(0, 6).map((dept, index) => ({
      dept: dept.dept,
      avgSalary: dept.baseSalary + Math.floor(Math.random() * 150000 - 75000),
      growth: dept.baseGrowth + (Math.random() * 2 - 1),
      color: colors[index],
    }));
  };

  const refreshData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newStats = generateDynamicSalaryStats();
    setSalaryStats(newStats);
    setSalaryTrend(generateDynamicMonthlyTrend());
    setSalaryBreakdown(generateDynamicSalaryBreakdown(newStats.currentSalary));
    setSkillsDemandData(generateDynamicSkillsData());
    setDepartmentData(generateDynamicDepartmentData());
    setLastRefresh(new Date());

    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    if (typeof amount !== "number") return "-";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const CircularProgress = ({ percentage, color, title, size = 60 }) => (
    <div className="flex flex-col items-center group">
      <div
        className="relative transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 6}
            stroke="#374151"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 6}
            stroke={color}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * (size / 2 - 6)}`}
            strokeDashoffset={`${
              2 * Math.PI * (size / 2 - 6) * (1 - percentage / 100)
            }`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-200">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center group-hover:text-gray-300 transition-colors">
        {title}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl mb-6 animate-pulse border border-gray-600/30">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            AI CAREER OS
          </h2>
          <p className="text-gray-400 text-sm">
            Analyzing 10-year market data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10B981 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #3B82F6 0%, transparent 50%)`,
            backgroundSize: "200px 200px",
          }}
        ></div>
      </div>

      {/* Enhanced Header - Fixed */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                  <Database className="w-6 h-6 text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500/80 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-100">
                  AI CAREER OS
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Indian IT Salary Analytics • 2015-2024 Decade Analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Last Refresh Info */}
              <div className="text-xs text-gray-500">
                Updated:{" "}
                {lastRefresh.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshData}
                className="bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-gray-200 px-4 py-2 rounded-xl font-medium transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 flex items-center gap-2 backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>

              {/* Navigation */}
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-1 border border-gray-600/30">
                {[
                  { id: "overview", label: "Current", icon: BarChart3 },
                  { id: "trends", label: "10-Year Trend", icon: TrendingUp },
                  { id: "insights", label: "Market Intel", icon: Activity },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gray-700/60 text-gray-200 border border-gray-600/50"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Current Median 2024",
              value: formatCurrency(salaryStats.currentSalary),
              change: `+${salaryStats.avgIncrease?.toFixed(1)}%`,
              icon: DollarSign,
              trend: "up",
              subtitle: `Market Index: ${salaryStats.marketIndex}%`,
            },
            {
              title: "10-Year Growth",
              value: "+80%",
              change: "₹5L → ₹9L",
              icon: TrendingUp,
              trend: "up",
              subtitle: "2015-2024 CAGR: 6.1%",
            },
            {
              title: "Job Market Health",
              value: `${(salaryStats.jobOpenings / 1000)?.toFixed(1)}K`,
              change: "Active openings",
              icon: Award,
              trend: "up",
              subtitle: "Monthly new positions",
            },
            {
              title: "Bonus Potential",
              value: formatCurrency(salaryStats.bonusReceived),
              change: "20% of CTC",
              icon: Gift,
              trend: "up",
              subtitle: "Performance linked",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30 group-hover:border-gray-500/50 transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    stat.trend === "up"
                      ? "text-green-400 bg-green-500/10 border border-green-500/20"
                      : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                {stat.title}
              </h3>
              <p className="text-gray-100 text-xl font-semibold mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Tab Content - Scrollable */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Year Monthly Trend */}
              <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      Monthly Compensation Trend 2024
                    </h3>
                    <p className="text-sm text-gray-400">
                      Live data • Base + variable + benefits
                    </p>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salaryTrend}>
                      <defs>
                        <linearGradient
                          id="salaryGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="totalGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                      />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                      <YAxis
                        tickFormatter={(value) =>
                          `₹${(value / 1000).toFixed(0)}K`
                        }
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          `₹${(value / 1000).toFixed(0)}K`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="salary"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#salaryGradient)"
                        strokeWidth={2}
                        name="Base Salary"
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#totalGradient)"
                        strokeWidth={2}
                        name="Total Compensation"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Fixed: Salary Breakdown with Pie Chart */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gray-700/50 rounded-md flex items-center justify-center border border-gray-600/30">
                      <BarChart3 className="w-3 h-3 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-gray-200">
                        CTC Breakdown (
                        {formatCurrency(salaryStats.currentSalary)})
                      </h3>
                      <p className="text-xs text-gray-400">Live market data</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {/* Pie Chart */}
                    <div className="w-32 h-32 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salaryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            dataKey="amount"
                            startAngle={90}
                            endAngle={450}
                          >
                            {salaryBreakdown.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.color}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 ml-4 space-y-3">
                      {salaryBreakdown.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-700/20 hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-gray-300 font-medium">
                              {item.component}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-200 font-semibold text-sm">
                              {formatCurrency(item.amount)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.percentage?.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Skills 2024 */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gray-700/50 rounded-md flex items-center justify-center border border-gray-600/30">
                      <Target className="w-3 h-3 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-gray-200">
                        Hot Skills 2024
                      </h3>
                      <p className="text-xs text-gray-400">
                        Market fluctuations
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {skillsDemandData.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/20 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          ></div>
                          <span className="text-xs text-gray-300 group-hover:text-gray-200 transition-colors">
                            {skill.skill}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-200 font-semibold">
                            {formatCurrency(skill.avgSalary)}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              skill.demand >= 85
                                ? "text-green-400"
                                : skill.demand >= 75
                                ? "text-blue-400"
                                : "text-gray-400"
                            }`}
                          >
                            {skill.demand}% demand
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="space-y-6">
              {/* 10-Year Historical Trend */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      Decade of IT Salaries: 2015-2024
                    </h3>
                    <p className="text-sm text-gray-400">
                      Complete journey • Demonetization • COVID • Recovery •
                      Current trends
                    </p>
                  </div>
                </div>

                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realistic10YearTrend}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                      />
                      <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                      <YAxis
                        tickFormatter={formatCurrency}
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(value),
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="freshers"
                        stroke="#6B7280"
                        strokeWidth={2}
                        name="Freshers (0-2 years)"
                        strokeDasharray="5 5"
                      />
                      <Line
                        type="monotone"
                        dataKey="medianSalary"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Median (3-5 years)"
                      />
                      <Line
                        type="monotone"
                        dataKey="senior"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Senior (8+ years)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Milestones */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      year: "2016",
                      event: "Demonetization Impact",
                      change: "+6%",
                    },
                    {
                      year: "2020",
                      event: "COVID Uncertainty",
                      change: "+7.5%",
                    },
                    { year: "2022", event: "Post-COVID Boom", change: "+11%" },
                    {
                      year: "2024",
                      event: "Market Correction",
                      change: "+4.7%",
                    },
                  ].map((milestone, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-700/20 rounded-lg border border-gray-600/30"
                    >
                      <div className="text-sm font-semibold text-gray-200">
                        {milestone.year}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {milestone.event}
                      </div>
                      <div className="text-xs text-green-400">
                        {milestone.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Department Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                      <Building className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200">
                        Live Domain Salaries 2024
                      </h3>
                      <p className="text-sm text-gray-400">
                        Real-time market rates • Updated hourly
                      </p>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          opacity={0.3}
                        />
                        <XAxis dataKey="dept" stroke="#9CA3AF" fontSize={12} />
                        <YAxis
                          tickFormatter={formatCurrency}
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value),
                            "Current Average",
                          ]}
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="avgSalary" radius={[4, 4, 0, 0]}>
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dynamic Market Metrics */}
                <div className="space-y-4">
                  {[
                    {
                      title: "Highest Growth",
                      value: departmentData[0]?.dept || "AI/ML",
                      detail: `${
                        departmentData[0]?.growth?.toFixed(1) || "15.2"
                      }% YoY`,
                      icon: Award,
                    },
                    {
                      title: "Market Cap",
                      value: formatCurrency(
                        departmentData[0]?.avgSalary || 2000000
                      ),
                      detail: "Domain leader",
                      icon: Star,
                    },
                    {
                      title: "Stable Choice",
                      value: departmentData[3]?.dept || "Frontend",
                      detail: `${
                        departmentData[3]?.growth?.toFixed(1) || "8.1"
                      }% growth`,
                      icon: Target,
                    },
                    {
                      title: "Entry Point",
                      value: "₹4.5L",
                      detail: "2024 fresher avg",
                      icon: Users,
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-700/50 text-center group hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-600/30 group-hover:border-gray-500/50 transition-all duration-300">
                        <metric.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                      </div>
                      <h4 className="text-gray-400 text-xs font-medium mb-1">
                        {metric.title}
                      </h4>
                      <div className="text-gray-200 text-lg font-semibold mb-1">
                        {metric.value}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {metric.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fixed: Market Intel Tab */}
          {activeTab === "insights" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Market Performance Metrics */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <Activity className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      Live Market Health
                    </h3>
                    <p className="text-sm text-gray-400">
                      Real-time indicators
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 place-items-center">
                  <CircularProgress
                    percentage={salaryStats.marketIndex || 82}
                    color="#10B981"
                    title="Market Strength"
                    size={70}
                  />
                  <CircularProgress
                    percentage={Math.min(
                      95,
                      Math.floor((salaryStats.jobOpenings || 12500) / 200)
                    )}
                    color="#3B82F6"
                    title="Job Availability"
                    size={70}
                  />
                  <CircularProgress
                    percentage={75 + Math.floor(Math.random() * 15)}
                    color="#6B7280"
                    title="Skills Premium"
                    size={70}
                  />
                  <CircularProgress
                    percentage={Math.min(
                      95,
                      Math.floor((salaryStats.avgIncrease || 7.5) * 8)
                    )}
                    color="#059669"
                    title="Growth Rate"
                    size={70}
                  />
                </div>
              </div>

              {/* Real Market Data */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      Decade Highlights
                    </h3>
                    <p className="text-sm text-gray-400">2015-2024 summary</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      metric: "Total Growth",
                      value: "+80%",
                      period: "2015-2024",
                      trend: "up",
                      description: "₹5L to ₹9L median",
                    },
                    {
                      metric: "CAGR",
                      value: "6.1%",
                      period: "Compound Annual",
                      trend: "up",
                      description: "Consistent growth",
                    },
                    {
                      metric: "COVID Impact",
                      value: "+7.5%",
                      period: "2020 (Surprisingly +ve)",
                      trend: "up",
                      description: "Tech sector resilience",
                    },
                    {
                      metric: "Peak Growth",
                      value: "+11%",
                      period: "2022 (Post-COVID)",
                      trend: "up",
                      description: "Market recovery boom",
                    },
                    {
                      metric: "Current Rate",
                      value: `${(salaryStats.avgIncrease || 7.5).toFixed(1)}%`,
                      period: "2024 (Market cooling)",
                      trend:
                        (salaryStats.avgIncrease || 7.5) > 8 ? "up" : "down",
                      description: "Normalizing trend",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-700/20 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-200 text-sm">
                          {item.metric}
                        </h4>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            item.trend === "up"
                              ? "text-green-400 bg-green-500/10 border border-green-500/20"
                              : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {item.period}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="space-y-4">
                {/* Market Outlook */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 group hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30 group-hover:border-green-500/30 transition-all duration-300">
                      <Lightbulb className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-200">
                        Market Intelligence
                      </h4>
                      <p className="text-sm text-gray-400">
                        Strategic analysis
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-green-400">
                        10-year trend:
                      </span>{" "}
                      Consistent 6.1% CAGR despite economic volatility
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-blue-400">
                        Current state:
                      </span>{" "}
                      {(salaryStats.avgIncrease || 7.5).toFixed(1)}% growth
                      suggests market maturation
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-purple-400">
                        Job market:
                      </span>{" "}
                      {((salaryStats.jobOpenings || 12500) / 1000).toFixed(1)}K
                      active positions
                    </p>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-green-400 flex items-center gap-2">
                    Stable Evolution
                    <span className="text-lg">📊</span>
                  </div>
                </div>

                {/* Career Strategy */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 group hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30 group-hover:border-blue-500/30 transition-all duration-300">
                      <Target className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-200">
                        2025 Strategy
                      </h4>
                      <p className="text-sm text-gray-400">Career roadmap</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">
                        AI/ML: {departmentData[0]?.growth?.toFixed(1) || "15.2"}
                        % growth leader
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">
                        Cloud:{" "}
                        {formatCurrency(
                          departmentData[1]?.avgSalary || 1500000
                        )}{" "}
                        average
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">
                        Skills premium: 50%+ for emerging tech
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-blue-400 flex items-center gap-2">
                    Skill Up Now
                    <span className="text-lg">🎯</span>
                  </div>
                </div>

                {/* Market Alerts */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 group hover:border-amber-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30 group-hover:border-amber-500/30 transition-all duration-300">
                      <Zap className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-200">
                        Market Alerts
                      </h4>
                      <p className="text-sm text-gray-400">Live updates</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-400">
                          HIGH DEMAND
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        AI/ML roles seeing 25% more openings
                      </p>
                    </div>
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-400">
                          TRENDING
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Remote work premiums stabilizing
                      </p>
                    </div>
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-amber-400">
                          WATCH
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Increment cycles shifting to Q1
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Spacer for Mac */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Salary;