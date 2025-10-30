import React, { useState, useEffect } from 'react';

interface ErrorDisplayProps {
  error?: Error | null;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  message,
  onRetry,
  onDismiss
}) => {
  if (!error && !message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <div className="text-red-400 text-xl mr-3">⚠️</div>
        <div className="flex-1">
          <h3 className="text-red-800 font-medium mb-2">
            {message || 'Something went wrong'}
          </h3>
          {error && (
            <p className="text-red-600 text-sm mb-3">
              {error.message}
            </p>
          )}
          <div className="flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-red-100 text-red-800 px-4 py-2 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Hook for managing error states
export const useErrorState = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: Error | string) => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    setError(errorObj);
    console.error('Error handled:', errorObj);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};

// Hook for managing loading states
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const startLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return { isLoading, loadingMessage, startLoading, stopLoading };
};

// Hook for async operations with loading and error handling
export const useAsyncOperation = () => {
  const { error, handleError, clearError } = useErrorState();
  const { isLoading, loadingMessage, startLoading, stopLoading } = useLoadingState();

  const execute = async <T,>(
    operation: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<T | null> => {
    try {
      clearError();
      startLoading(options?.loadingMessage);
      
      const result = await operation();
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      handleError(error);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return null;
    } finally {
      stopLoading();
    }
  };

  return {
    execute,
    isLoading,
    loadingMessage,
    error,
    clearError
  };
};