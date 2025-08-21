/**
 * Environment variable utility to consistently access environment variables
 * across the application
 */

export const getEnv = (key: string): string => {
  // First try Vite's import.meta.env approach for client-side
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Check if the variable exists with VITE_ prefix
    if (import.meta.env[`VITE_${key}`]) {
      return import.meta.env[`VITE_${key}`];
    }
    
    // Check if the variable exists without prefix
    if (import.meta.env[key]) {
      return import.meta.env[key];
    }
  }
  
  // For server-side, try Node's process.env
  // This won't be used in client code, but helpful for SSR or shared code
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) {
      return process.env[key];
    }
  }
  
  return '';
};

// Commonly used environment variables
export const ENV = {
  GOOGLE_MAPS_API_KEY: getEnv('GOOGLE_MAPS_API_KEY'),
  DEEPSEEK_API_KEY: getEnv('DEEPSEEK_API_KEY')
};