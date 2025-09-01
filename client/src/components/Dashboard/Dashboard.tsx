import React, { useEffect } from 'react';
import { Bot, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserData } from '../../utils/api';

export default function Dashboard() {
  const user = useSelector((state: any) => state.user.authUserDetails);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      updateUserData().catch(console.error);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const requestsProgress = (user.plan.requestsLeft / user.plan.requestsLimit) * 100;

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back, {user.profile.name}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Here's an overview of your BotCraft account
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Plan Status */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
              user.plan.currentPlan === 'PRO' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}>
              {user.plan.currentPlan}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Current Plan</h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {user.plan.currentPlan === 'FREE' ? 'Free tier with basic features' : 'Pro tier with advanced features'}
          </p>
        </div>

        {/* Requests Left */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            <span className="text-xl sm:text-2xl font-bold text-white">{user.plan.requestsLeft}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Requests Left</h3>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${requestsProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {Math.round(requestsProgress)}% remaining
          </p>
        </div>

        {/* Total Bots */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <span className="text-xl sm:text-2xl font-bold text-white">{user.stats.totalBots}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Total Bots</h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {user.plan.currentPlan === 'FREE' ? `${user.stats.botsLimit - user.stats.totalBots} slots remaining` : `${user.stats.botsLimit - user.stats.totalBots} slots remaining`}
          </p>
        </div>

        {/* Account Created */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Account Created</h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {formatDate(user.profile.createdAt)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Bots</h2>
          {user.bots && user.bots.length > 0 ? (
            <div className="space-y-3">
              {user.bots?.slice(0, 3).map((bot: any) => (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{bot.name}</p>
                      <p className="text-gray-400 text-sm">Created {formatDate(bot.createdAt)}</p>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/bot/${bot.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No bots created yet. Start by generating your first bot!</p>
          )}
        </div>
      </div>
    </div>
  );
}