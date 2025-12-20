import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaCrown } from "react-icons/fa";

interface SubscriptionPromptProps {
  courseTitle: string;
}

export default function SubscriptionPrompt({ courseTitle }: SubscriptionPromptProps) {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Monthly",
      price: 29,
      period: "month",
      features: [
        "Access to all courses",
        "New courses added monthly",
        "Progress tracking",
        "Certificate of completion",
        "Cancel anytime"
      ],
      recommended: false
    },
    {
      name: "Lifetime",
      price: 299,
      period: "one-time",
      features: [
        "Lifetime access to all courses",
        "All future courses included",
        "Priority support",
        "Progress tracking",
        "Certificate of completion",
        "One-time payment"
      ],
      recommended: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-800">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
          <FaCrown className="text-3xl text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
          Subscribe to Access All Courses
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Get unlimited access to this course and all others with a single subscription
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-neutral-800 rounded-lg p-6 border-2 transition-all hover:shadow-xl ${
              plan.recommended
                ? 'border-purple-500 shadow-lg'
                : 'border-neutral-200 dark:border-neutral-700'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
                {plan.name}
              </h4>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  ${plan.price}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  /{plan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/checkout', { state: { plan: plan.name.toLowerCase() } })}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                plan.recommended
                  ? 'button1'
                  : 'bg-neutral-800 dark:bg-neutral-700 text-white hover:bg-neutral-700 dark:hover:bg-neutral-600'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
        Already have a subscription? <button onClick={() => navigate('/login')} className="text-purple-600 dark:text-purple-400 hover:underline">Sign in</button>
      </p>
    </div>
  );
}
