import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { Check, Shield, Zap, AlertCircle, CreditCard } from "lucide-react";

type PlanType = 'monthly' | 'lifetime';

interface PlanConfig {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  priceId: string;
  mode: 'subscription' | 'payment';
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, loading, hasActiveSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('lifetime');
  const [processing, setProcessing] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

  const plans: Record<PlanType, PlanConfig> = {
    monthly: {
      name: 'Monthly Subscription',
      price: 29.99,
      period: '/month',
      description: 'Perfect for short-term learning goals',
      features: [
        'Access to all courses',
        'New courses added monthly',
        'Community support',
        'Certificate of completion',
        'Cancel anytime',
      ],
      priceId: 'price_monthly',
      mode: 'subscription',
    },
    lifetime: {
      name: 'Lifetime Access',
      price: 299.99,
      period: 'one-time',
      description: 'Best value for committed learners',
      features: [
        'Unlimited access to all courses',
        'All future courses included',
        'Priority support',
        'Certificate of completion',
        'Exclusive community access',
        'Early access to new features',
      ],
      priceId: 'price_lifetime',
      mode: 'payment',
    },
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
    if (!loading && hasActiveSubscription) {
      navigate('/courses');
    }
  }, [user, loading, hasActiveSubscription, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please login to continue');
        navigate('/auth/login');
        return;
      }

      const plan = plans[selectedPlan];
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const currentUrl = window.location.origin;

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: plan.priceId,
          mode: plan.mode,
          success_url: `${currentUrl}/courses?success=true`,
          cancel_url: `${currentUrl}/checkout?canceled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('price_id') || data.error?.includes('No such price') || data.error?.includes('Stripe')) {
          setSetupRequired(true);
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      const isStripeSetupError = error?.message?.includes('Stripe') ||
                                  error?.message?.includes('price_id') ||
                                  error?.message?.includes('No such price');

      if (!isStripeSetupError) {
        console.error('Checkout error:', error);
        toast.error(error.message || 'Failed to start checkout. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-5 py-20 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Choose Your <span className="text-teal-500">Learning Plan</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Unlock unlimited access to all courses and start your learning journey today
          </p>
        </div>

        {setupRequired && (
          <div className="max-w-3xl mx-auto mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Stripe Setup Required
                </h3>
                <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
                  <p>To enable payments, you need to create products in your Stripe Dashboard:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <a href="https://dashboard.stripe.com/test/products" target="_blank" rel="noopener noreferrer" className="underline font-medium">Stripe Dashboard → Products</a></li>
                    <li>Create a <strong>Recurring Product</strong> for Monthly Subscription ($29.99/month)
                      <ul className="list-disc list-inside ml-6 mt-1 text-xs">
                        <li>Copy the Price ID (starts with <code>price_</code>)</li>
                        <li>Update <code>plans.monthly.priceId</code> in Checkout.tsx</li>
                      </ul>
                    </li>
                    <li>Create a <strong>One-time Product</strong> for Lifetime Access ($299.99)
                      <ul className="list-disc list-inside ml-6 mt-1 text-xs">
                        <li>Copy the Price ID</li>
                        <li>Update <code>plans.lifetime.priceId</code> in Checkout.tsx</li>
                      </ul>
                    </li>
                    <li>Set up webhook endpoint in Stripe:
                      <ul className="list-disc list-inside ml-6 mt-1 text-xs">
                        <li>URL: <code>{import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-webhook</code></li>
                        <li>Events: <code>checkout.session.completed</code>, <code>customer.subscription.*</code></li>
                        <li>Copy webhook secret and add to Supabase secrets</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {(Object.keys(plans) as PlanType[]).map((planKey) => {
            const plan = plans[planKey];
            const isSelected = selectedPlan === planKey;
            const isRecommended = planKey === 'lifetime';

            return (
              <div
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`relative rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-2xl scale-105'
                    : 'bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 hover:border-teal-500 dark:hover:border-teal-500'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-neutral-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-neutral-800 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'bg-white border-white' : 'border-gray-300 dark:border-neutral-600'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isSelected ? 'text-white' : 'text-neutral-800 dark:text-white'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ${isSelected ? 'text-white/80' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 ${isSelected ? 'text-white/90' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-teal-500'}`} />
                      <span className={isSelected ? 'text-white/90' : 'text-neutral-700 dark:text-neutral-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-500/10 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Complete Your Purchase
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-teal-800 dark:text-teal-300">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and processed securely by Stripe. We never store your card details.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                    Total Amount
                  </span>
                  <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    ${plans[selectedPlan].price}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Proceed to Secure Checkout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              {selectedPlan === 'monthly' && ' You can cancel anytime from your dashboard.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
