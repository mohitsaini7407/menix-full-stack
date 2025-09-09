import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import apiService from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Pay = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await apiService.get('/api/razorpay/key');
        if (res?.success && res?.key) setRazorpayKey(res.key);
      } catch (_) {
        // ignore
      }
    }
    fetchKey();
  }, []);

  const loadScript = (src) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePay = async () => {
    if (!user) return alert('Please login first');
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return alert('Enter valid amount');
    setLoading(true);
    try {
      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!ok) throw new Error('Failed to load Razorpay');

      const orderRes = await apiService.post('/api/razorpay/order', { amount: numericAmount });
      if (!orderRes?.success) throw new Error('Failed to create order');
      const { id: order_id, amount: order_amount, currency } = orderRes.order;

      const options = {
        key: razorpayKey,
        amount: order_amount,
        currency: currency || 'INR',
        name: 'Menix',
        description: 'Add Money to Wallet',
        order_id,
        prefill: {
          name: user?.username || 'Menix User',
          email: user?.email || 'user@example.com',
        },
        notes: {
          purpose: 'wallet_topup',
          userId: user?.id,
        },
        handler: async function (response) {
          try {
            const verifyRes = await apiService.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?.id,
              amount: numericAmount,
            });
            if (verifyRes?.success) {
              alert('Payment successful! Wallet will update shortly.');
            } else {
              alert('Verification failed.');
            }
          } catch (e) {
            alert('Verification error');
          }
        },
        theme: { color: '#ef4444' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert(e.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Add Money" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20">
          <label className="block text-gray-200 mb-2 font-semibold">Amount (₹)</label>
          <input
            type="number"
            className="w-full rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
          <button
            onClick={handlePay}
            disabled={loading || !razorpayKey}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          {!razorpayKey && (
            <p className="text-yellow-300 text-sm mt-2">Razorpay not configured.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Pay; 