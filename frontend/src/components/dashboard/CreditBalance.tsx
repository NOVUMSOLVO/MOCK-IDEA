'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface CreditBalanceProps {
  credits?: number;
  className?: string;
}

export function CreditBalance({ credits, className = '' }: CreditBalanceProps) {
  const { user } = useAuth();
  
  const actualCredits = credits ?? user?.creditsRemaining ?? 0;
  const subscriptionTier = user?.subscriptionTier ?? 'FREE';

  const getCreditColor = () => {
    if (subscriptionTier === 'UNLIMITED') return 'text-purple-600';
    if (actualCredits === 0) return 'text-red-600';
    if (actualCredits <= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCreditBgColor = () => {
    if (subscriptionTier === 'UNLIMITED') return 'bg-purple-50 border-purple-200';
    if (actualCredits === 0) return 'bg-red-50 border-red-200';
    if (actualCredits <= 2) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  const getCreditIcon = () => {
    if (subscriptionTier === 'UNLIMITED') return <SparklesIcon className="h-5 w-5" />;
    if (actualCredits === 0) return <ExclamationTriangleIcon className="h-5 w-5" />;
    if (actualCredits <= 2) return <ExclamationTriangleIcon className="h-5 w-5" />;
    return <InformationCircleIcon className="h-5 w-5" />;
  };

  const getCreditText = () => {
    if (subscriptionTier === 'UNLIMITED') return 'Unlimited';
    return actualCredits.toString();
  };

  const getSubText = () => {
    if (subscriptionTier === 'UNLIMITED') return 'Unlimited mockups';
    if (actualCredits === 0) return 'No credits remaining';
    if (actualCredits === 1) return '1 mockup remaining';
    return `${actualCredits} mockups remaining`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-3 px-4 py-3 rounded-lg border-2 ${getCreditBgColor()} ${className}`}
    >
      <div className={`flex items-center space-x-2 ${getCreditColor()}`}>
        {getCreditIcon()}
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">
              {getCreditText()}
            </span>
            {subscriptionTier !== 'UNLIMITED' && (
              <span className="text-sm font-medium">
                credits
              </span>
            )}
          </div>
          <p className="text-xs opacity-75">
            {getSubText()}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {actualCredits === 0 && subscriptionTier !== 'UNLIMITED' && (
        <Link href="/subscription">
          <Button size="sm" className="ml-3">
            Get More Credits
          </Button>
        </Link>
      )}

      {actualCredits <= 2 && actualCredits > 0 && subscriptionTier === 'FREE' && (
        <Link href="/subscription">
          <Button size="sm" variant="outline" className="ml-3">
            Upgrade
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

// Alternative compact version for smaller spaces
export function CreditBadge({ credits, className = '' }: CreditBalanceProps) {
  const { user } = useAuth();
  
  const actualCredits = credits ?? user?.creditsRemaining ?? 0;
  const subscriptionTier = user?.subscriptionTier ?? 'FREE';

  const getCreditColor = () => {
    if (subscriptionTier === 'UNLIMITED') return 'bg-purple-100 text-purple-800';
    if (actualCredits === 0) return 'bg-red-100 text-red-800';
    if (actualCredits <= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCreditColor()} ${className}`}>
      {subscriptionTier === 'UNLIMITED' ? (
        <>
          <SparklesIcon className="h-3 w-3 mr-1" />
          Unlimited
        </>
      ) : (
        <>
          {actualCredits} credit{actualCredits !== 1 ? 's' : ''}
        </>
      )}
    </span>
  );
}
