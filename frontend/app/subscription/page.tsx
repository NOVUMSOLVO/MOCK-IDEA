'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  CheckIcon,
  SparklesIcon,
  CreditCardIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    tier: 'FREE',
    name: 'Starter',
    price: 0,
    credits: 3,
    description: 'Perfect for trying out MOCK IDEA',
    features: [
      '3 mockups per month',
      'Basic templates',
      'Standard resolution downloads',
      'Email support',
    ],
    popular: false,
    stripePriceId: null,
  },
  {
    tier: 'BASIC',
    name: 'Basic',
    price: 9,
    credits: 25,
    description: 'Great for small projects and freelancers',
    features: [
      '25 mockups per month',
      'All basic templates',
      'High resolution downloads',
      'Priority email support',
      'Commercial license',
    ],
    popular: false,
    stripePriceId: 'price_basic_monthly',
  },
  {
    tier: 'PRO',
    name: 'Pro',
    price: 29,
    credits: 100,
    description: 'Perfect for agencies and growing businesses',
    features: [
      '100 mockups per month',
      'All templates including premium',
      'Ultra-high resolution downloads',
      'Priority support',
      'Commercial license',
      'Custom branding removal',
      'API access',
    ],
    popular: true,
    stripePriceId: 'price_pro_monthly',
  },
  {
    tier: 'UNLIMITED',
    name: 'Unlimited',
    price: 99,
    credits: 999999,
    description: 'For power users and large teams',
    features: [
      'Unlimited mockups',
      'All templates + early access',
      'Ultra-high resolution downloads',
      'Dedicated support',
      'Commercial license',
      'Custom branding removal',
      'API access',
      'Team collaboration',
      'Custom templates',
    ],
    popular: false,
    stripePriceId: 'price_unlimited_monthly',
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (stripePriceId: string | null, tier: string) => {
    if (!stripePriceId) return;

    setIsLoading(tier);
    try {
      // Here you would integrate with Stripe
      console.log('Subscribing to:', tier, stripePriceId);
      // const response = await api.createCheckoutSession(stripePriceId);
      // window.location.href = response.data.url;
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return <CreditCardIcon className="h-6 w-6" />;
      case 'BASIC':
        return <CheckIcon className="h-6 w-6" />;
      case 'PRO':
        return <SparklesIcon className="h-6 w-6" />;
      case 'UNLIMITED':
        return <ArrowPathIcon className="h-6 w-6" />;
      default:
        return <CreditCardIcon className="h-6 w-6" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start creating professional mockups today. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Current Plan Banner */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Current Plan: {user.subscriptionTier}
                </h3>
                <p className="text-blue-700">
                  {user.creditsRemaining} credits remaining this month
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage Subscription
              </Button>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getPlanIcon(plan.tier)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {plan.credits === 999999 ? 'Unlimited' : plan.credits}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">
                        {plan.credits === 999999 ? 'mockups' : 'mockups/month'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {user?.subscriptionTier === plan.tier ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : plan.tier === 'FREE' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Free Forever
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                        onClick={() => handleSubscribe(plan.stripePriceId, plan.tier)}
                        loading={isLoading === plan.tier}
                        disabled={!user}
                      >
                        {user ? 'Subscribe Now' : 'Sign In to Subscribe'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to unused credits?
              </h3>
              <p className="text-gray-600 text-sm">
                Unused credits don't roll over to the next month, so make sure to use them before your billing cycle resets.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! Every new account starts with 3 free mockups to try out our service.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-gray-600 mb-6">
                Create your account and start making professional mockups today.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
