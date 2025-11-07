/**
 * Maps server error responses to user-friendly messages
 */

export const getErrorMessage = (error: any): string => {
  // If error is already a user-friendly string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Extract error message from various error response formats
  const errorMessage = 
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    error?.detail ||
    error;

  // Convert to string if not already
  const msg = String(errorMessage || '').trim();

  // Map common server error messages to user-friendly ones
  const errorMappings: Record<string, string> = {
    // Authentication errors
    'Not authenticated': 'Please sign in to continue',
    'Invalid credentials': 'Invalid email or password',
    'User already exists': 'An account with this email already exists',
    'User not found': 'User account not found',
    'Invalid or expired token': 'Your session has expired. Please sign in again',
    
    // Validation errors
    'Validation error': 'Please check your input and try again',
    'Invalid input': 'Please check your input and try again',
    'Missing required field': 'Please fill in all required fields',
    
    // Workflow errors
    'Workflow not found': 'Workflow not found',
    'Failed to load workflow': 'Unable to load workflow. Please try again',
    'Failed to save workflow': 'Unable to save workflow. Please try again',
    'Failed to create workflow': 'Unable to create workflow. Please try again',
    'Failed to update workflow': 'Unable to update workflow. Please try again',
    'Failed to delete workflow': 'Unable to delete workflow. Please try again',
    
    // Execution errors
    'Execution failed': 'Workflow execution failed. Please try again',
    'Execution not found': 'Execution not found',
    'Failed to start execution': 'Unable to start workflow execution',
    'Execution timed out': 'Workflow execution took too long. Please try again',
    
    // Credential errors
    'Credential not found': 'Credential not found',
    'Failed to create credential': 'Unable to create credential. Please check your inputs',
    'Failed to update credential': 'Unable to update credential. Please check your inputs',
    'Failed to delete credential': 'Unable to delete credential',
    'Invalid credential': 'Invalid credential. Please check your configuration',
    
    // Network errors
    'Network Error': 'Unable to connect to the server. Please check your connection',
    'Request failed': 'Request failed. Please try again',
    'Timeout': 'Request timed out. Please try again',
    
    // Generic errors
    'Internal server error': 'Something went wrong. Please try again later',
    'Bad Request': 'Invalid request. Please check your input',
    'Unauthorized': 'You are not authorized to perform this action',
    'Forbidden': 'Access denied',
    'Not Found': 'The requested resource was not found',
  };

  // Check for exact matches first
  if (msg && errorMappings[msg]) {
    return errorMappings[msg];
  }

  // Check for partial matches (case-insensitive)
  const lowerMsg = msg.toLowerCase();
  for (const [key, value] of Object.entries(errorMappings)) {
    if (lowerMsg.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Check for HTTP status codes
  const status = error?.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input';
      case 401:
        return 'Please sign in to continue';
      case 403:
        return 'You are not authorized to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 409:
        return 'A conflict occurred. Please try again';
      case 422:
        return 'Invalid input. Please check your data';
      case 429:
        return 'Too many requests. Please wait a moment and try again';
      case 500:
        return 'Server error. Please try again later';
      case 502:
        return 'Service temporarily unavailable. Please try again later';
      case 503:
        return 'Service unavailable. Please try again later';
      default:
        if (status >= 500) {
          return 'Server error. Please try again later';
        } else if (status >= 400) {
          return 'Request failed. Please check your input';
        }
    }
  }

  // If we have a message but no mapping, return a generic message
  if (msg && msg.length > 0) {
    // For very technical messages, return a generic one
    if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND') || msg.includes('ETIMEDOUT')) {
      return 'Unable to connect to the server. Please check your connection';
    }
    
    // If message looks user-friendly (short, no technical jargon), return it
    if (msg.length < 100 && !msg.includes('Error:') && !msg.includes('Exception:')) {
      return msg;
    }
  }

  // Default fallback
  return 'Something went wrong. Please try again';
};

/**
 * Extracts a user-friendly error message from an error object
 * This is a convenience wrapper around getErrorMessage
 */
export const extractErrorMessage = (error: any): string => {
  return getErrorMessage(error);
};

