'use client';
import React from 'react';
import { Check, X } from 'lucide-react';

// TypeScript interfaces
interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: PricingFeature[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant: 'primary' | 'secondary' | 'accent';
}

interface FeatureProps {
  children: React.ReactNode;
  included: boolean;
}

const PricingPage: React.FC = () => {
  // Define pricing plans with TypeScript
  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small projects',
      price: 29,
      interval: '/month',
      buttonText: 'Start Free Trial',
      buttonVariant: 'secondary',
      features: [
        { text: 'Up to 5 interviews', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom branding', included: false },
        { text: 'AI-powered insights', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing businesses',
      price: 79,
      interval: '/month',
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      isPopular: true,
      features: [
        { text: 'Up to 50 interviews', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom branding', included: true },
        { text: 'AI-powered insights', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 199,
      interval: '/month',
      buttonText: 'Contact Sales',
      buttonVariant: 'accent',
      features: [
        { text: 'Unlimited interviews', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom branding', included: true },
        { text: 'AI-powered insights', included: true },
        { text: 'Priority support', included: true },
      ],
    },
  ];

  // Function to get button classes based on variant
  const getButtonClasses = (variant: PricingPlan['buttonVariant']): string => {
    const baseClasses = "mt-8 w-full font-medium py-3 px-4 rounded-lg transition-colors duration-300";
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
      case 'secondary':
        return `${baseClasses} bg-gray-700 hover:bg-gray-600 text-gray-200`;
      case 'accent':
        return `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="bg-black py-16 px-4 text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                plan.isPopular ? 'shadow-xl ring-2 ring-blue-500 transform scale-105' : 'shadow-lg'
              }`}
            >
              {plan.isPopular && (
                <div className="bg-blue-600 text-white py-2 text-center font-medium">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.interval}</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <Feature key={index} included={feature.included}>
                      {feature.text}
                    </Feature>
                  ))}
                </ul>
                <button className={getButtonClasses(plan.buttonVariant)}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-300">
            Have questions about our pricing? <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Contact us</a> or check our <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">FAQ</a>.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            All prices are in USD and exclude applicable taxes.
          </p>
        </div>
      </div>
    </div>
  );
};

// Feature component with TypeScript props
const Feature: React.FC<FeatureProps> = ({ children, included = false }) => {
  return (
    <li className="flex items-center">
      {included ? (
        <Check size={20} className="text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X size={20} className="text-gray-500 mr-2 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-200" : "text-gray-500"}>
        {children}
      </span>
    </li>
  );
};

export default PricingPage;