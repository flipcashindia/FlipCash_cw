// src/components/shared/index.tsx

import React from 'react';
import { Loader2, Inbox, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

// =============================================================================
// FLIPCASH COLORS
// =============================================================================
export const COLORS = {
  primary: '#FEC925',      // Yellow
  success: '#1B8A05',      // Green
  error: '#FF0000',        // Red
  text: '#1C1C1B',         // Black
  gray: '#666666',
  lightGray: '#F5F5F5',
  processing: '#0066CC',   // Blue
  warning: '#FFA500',      // Orange
};

// =============================================================================
// LOADING SPINNER
// =============================================================================
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#FEC925]`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// =============================================================================
// STATUS BADGE
// =============================================================================
// type StatusType = 
//   | 'success' | 'completed' | 'paid' | 'verified' | 'active'
//   | 'pending' | 'processing' 
//   | 'failed' | 'error' | 'rejected' | 'cancelled'
//   | 'reversed' | 'expired';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalizedStatus = status.toLowerCase();
  
  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'success':
      case 'completed':
      case 'paid':
      case 'verified':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'active':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw };
      case 'failed':
      case 'error':
      case 'rejected':
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      case 'reversed':
      case 'expired':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses} ${config.bg} ${config.text} rounded-full font-medium capitalize`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {status}
    </span>
  );
};

// =============================================================================
// EMPTY STATE
// =============================================================================
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-[#FEC925] text-[#1C1C1B] rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// =============================================================================
// ERROR MESSAGE
// =============================================================================
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// CARD COMPONENT
// =============================================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = 'md' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// =============================================================================
// BUTTON COMPONENT
// =============================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#FEC925] text-[#1C1C1B] hover:bg-yellow-400 focus:ring-yellow-500 disabled:bg-yellow-200',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50',
    outline: 'border-2 border-[#FEC925] text-[#1C1C1B] hover:bg-yellow-50 focus:ring-yellow-500 disabled:border-gray-200 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'cursor-not-allowed opacity-60' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// =============================================================================
// AMOUNT DISPLAY
// =============================================================================
interface AmountDisplayProps {
  amount: string | number;
  type?: 'credit' | 'debit' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  currency?: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  type = 'neutral',
  size = 'md',
  showSign = false,
  currency = '₹',
}) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  const colorClasses = {
    credit: 'text-green-600',
    debit: 'text-red-600',
    neutral: 'text-gray-900',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const sign = showSign ? (type === 'credit' ? '+' : type === 'debit' ? '-' : '') : '';

  return (
    <span className={`font-semibold ${colorClasses[type]} ${sizeClasses[size]}`}>
      {sign}{currency}{numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

// =============================================================================
// PAGE HEADER
// =============================================================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1B]">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};