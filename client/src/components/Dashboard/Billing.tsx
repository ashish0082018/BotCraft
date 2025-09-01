import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Clock, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { Payment } from '../../types/';
import { updateUserData } from '../../utils/api';
import { setauthUserDetail } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

// Declare Razorpay as a global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Billing() {
  const user = useSelector((state: any) => state.user.authUserDetails);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      updateUserData().catch(console.error);
    }
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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

  const handleUpgradeToPro = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const keyResponse = await axios.get('http://localhost:3000/api/v1/user/getkey');
      if (!keyResponse.data.success || !keyResponse.data.key) {
          throw new Error("Could not retrieve payment key.");
      }
      const razorpayKey = keyResponse.data.key;
      // Create order
      const orderResponse = await fetch('http://localhost:3000/api/v1/user/createorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 200000 }), // 2000 INR in paise
        credentials: 'include',
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const order = orderData.data;

      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'BotCraft',
        description: 'Pro Plan Upgrade',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('http://localhost:3000/api/v1/user/verifyorder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
              credentials: 'include',
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Your account has been upgraded to Pro.');
              
              // Update user data in Redux
              const updatedUser = {
                ...user,
                plan: { ...user.plan, currentPlan: 'PRO' },
                requestsLeft: 15000
              };
              dispatch(setauthUserDetail(updatedUser));
              
              // Refresh user data
              await updateUserData();
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.profile?.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      // Open Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Current Plan</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold text-white">{user.plan.currentPlan} Plan</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {user.plan.currentPlan === 'FREE' 
                ? `Up to ${user.stats.botsLimit} bots • ${user.plan.requestsLimit} API requests` 
                : `Up to 10 bots • 15,000 API requests`
              }
            </p>
          </div>
          <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${
            user.plan.currentPlan === 'PRO' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}>
            {user.plan.currentPlan}
          </span>
        </div>

        {user.plan.currentPlan === 'FREE' && (
          <div className="border-t border-gray-700 pt-4 sm:pt-6">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Upgrade to Pro</h4>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="mb-4 sm:mb-0">
                  <h5 className="text-white font-semibold text-sm sm:text-base">Pro Plan</h5>
                  <p className="text-gray-400 text-xs sm:text-sm">Perfect for growing businesses</p>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold text-white">₹2,000</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <li className="flex items-center text-gray-300">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-2 flex-shrink-0" />
                  Up to 10 bots (vs 2 in free)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-2 flex-shrink-0" />
                  15,000 API requests (vs 1,000 in free)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-2 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-2 flex-shrink-0" />
                  Advanced analytics
                </li>
              </ul>
              
              <button 
                onClick={handleUpgradeToPro}
                disabled={isProcessing}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                {isProcessing ? 'Processing...' : 'Upgrade with Razorpay'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Payment History</h2>
        
        {user.paymentHistory && user.paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-2 sm:py-3 text-xs sm:text-sm">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-2 sm:py-3 text-xs sm:text-sm">Status</th>
                  <th className="text-left text-gray-400 font-medium py-2 sm:py-3 text-xs sm:text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.paymentHistory.map((payment: any) => (
                  <tr key={payment.id} className="border-b border-gray-800">
                    <td className="py-3 sm:py-4 text-white font-medium text-xs sm:text-sm">
                      ₹{payment.amount.toFixed(2)}
                    </td>
                    <td className="py-3 sm:py-4">
                      <span className={`flex items-center space-x-2 ${getStatusColor(payment.status)} text-xs sm:text-sm`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status.toLowerCase()}</span>
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 text-gray-400 text-xs sm:text-sm">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}