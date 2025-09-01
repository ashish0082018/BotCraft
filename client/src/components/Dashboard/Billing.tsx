import React, { useEffect } from 'react';
import { CreditCard, Check, Clock, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { Payment } from '../../types/';
import { updateUserData } from '../../utils/api';

export default function Billing() {
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'FAILED':
        return <X className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-400';
      case 'PENDING':
        return 'text-yellow-400';
      case 'FAILED':
        return 'text-red-400';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-gray-400">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Current Plan</h2>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">{user.plan.currentPlan} Plan</h3>
            <p className="text-gray-400">
              {user.plan.currentPlan === 'FREE' 
                ? `Up to ${user.stats.botsLimit} bots • ${user.plan.requestsLimit} API requests` 
                : `Up to ${user.stats.botsLimit} bots • ${user.plan.requestsLimit} API requests`
              }
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            user.plan.currentPlan === 'PRO' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}>
            {user.plan.currentPlan}
          </span>
        </div>

        {user.plan.currentPlan === 'FREE' && (
          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Upgrade to Pro</h4>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-white font-semibold">Pro Plan</h5>
                  <p className="text-gray-400 text-sm">Perfect for growing businesses</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  Up to 10 bots (vs 2 in free)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  15,000 API requests (vs 1,000 in free)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  Advanced analytics
                </li>
              </ul>
              
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
                <CreditCard className="h-4 w-4 inline mr-2" />
                Upgrade with Razorpay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Payment History</h2>
        
        {user.paymentHistory && user.paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.paymentHistory.map((payment: any) => (
                  <tr key={payment.id} className="border-b border-gray-800">
                    <td className="py-4 text-white font-medium">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center space-x-2 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status.toLowerCase()}</span>
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}