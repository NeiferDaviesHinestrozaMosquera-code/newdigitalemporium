import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, FileText, Users,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subscribeToQuoteRequests } from '@/services/firebase';

const StatCard = ({ icon: Icon, title, value, change, color }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  change?: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <span className="text-sm text-green-500 font-medium">{change}</span>
          )}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-muted-foreground text-sm">{title}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export function Dashboard() {
  const [stats, setStats] = useState({
    services: 12,
    projects: 6,
    quotes: 0,
    pendingQuotes: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to quote updates
    const unsubscribe = subscribeToQuoteRequests((quotes) => {
      setStats(prev => ({
        ...prev,
        quotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
      }));
      setRecentQuotes(quotes.slice(0, 5));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Services"
          value={stats.services}
          color="bg-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Projects"
          value={stats.projects}
          color="bg-green-500"
        />
        <StatCard
          icon={Users}
          title="Quote Requests"
          value={stats.quotes}
          change="+12%"
          color="bg-purple-500"
        />
        <StatCard
          icon={Activity}
          title="Pending Quotes"
          value={stats.pendingQuotes}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Revenue chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Quote Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Status chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Quote Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent quote requests
                </div>
              ) : (
                recentQuotes.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{quote.fullName}</p>
                        <p className="text-sm text-muted-foreground">{quote.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-700'
                          : quote.status === 'quoted'
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-blue-500/20 text-blue-700'
                      }`}>
                        {quote.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
