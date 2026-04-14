"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const trafficData = [
    { day: 1, views: 2400 },
    { day: 5, views: 1398 },
    { day: 10, views: 9800 },
    { day: 15, views: 3908 },
    { day: 20, views: 4800 },
    { day: 25, views: 3800 },
    { day: 30, views: 4300 },
]

const activities = [
  {
    id: 1,
    type: "comment",
    title: 'New comment on "The Future of AI"',
    time: "2 hours ago",
    icon: "💬",
    bgColor: "bg-indigo-100",
  },
  {
    id: 2,
    type: "post",
    title: 'John Doe published "Getting Started with Vue 3"',
    time: "1 day ago",
    icon: "📝",
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    type: "user",
    title: "New user Jane Smith registered.",
    time: "3 days ago",
    icon: "👤",
    bgColor: "bg-pink-100",
  },
  {
    id: 4,
    type: "comment",
    title: 'New comment on "Design Systems 101"',
    time: "4 days ago",
    icon: "💬",
    bgColor: "bg-indigo-100",
  },
]

const metrics = [
    { label: "Total Posts", value: "1,204", change: "+12%", changeType: "positive" },
    { label: "Total Views", value: "245,678", change: "+5.4%", changeType: "positive" },
    { label: "Total Comments", value: "4,321", change: "+8%", changeType: "positive" },
    { label: "New Subscribers", value: "352", change: "+2.1%", changeType: "positive" },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-lg text-gray-600">Here's a summary of your blog's performance.</p>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-12">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="mt-2 text-sm font-medium text-green-600">{metric.change} this month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Website Traffic (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center text-lg`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
