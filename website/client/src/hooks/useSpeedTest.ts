import { useState, useEffect, useRef } from 'react';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  unit: string;
}

export function useSpeedTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResult[]>([]);
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Simulated speed test for browser environment
  const runTest = async () => {
    try {
      setIsRunning(true);
      setProgress(0);
      setError(null);
      setResults([]);
      setAverageSpeed(null);

      // Start progress animation
      const progressInterval = window.setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 2;
          return newProgress <= 100 ? newProgress : 100;
        });
      }, 100);
      
      progressIntervalRef.current = progressInterval;

      // Simulate multiple tests with realistic ranges for Somerset West, South Africa
      // Based on typical speeds in the area
      const testResults: SpeedTestResult[] = [];
      const testCount = 3;

      for (let i = 0; i < testCount; i++) {
        // Add randomness with a base range typical for South African coffee shops
        // (10-50 Mbps is common in urban areas)
        const baseSpeed = 15 + Math.random() * 35;
        // Add some variation between tests
        const variationFactor = 0.85 + Math.random() * 0.3;
        const speed = Math.round(baseSpeed * variationFactor);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        testResults.push({
          downloadSpeed: speed,
          uploadSpeed: Math.round(speed * 0.7), // Upload typically slower than download
          unit: 'Mbps'
        });
        
        setResults([...testResults]);
      }

      // Calculate average speed
      const avgSpeed = Math.round(
        testResults.reduce((acc, result) => acc + result.downloadSpeed, 0) / testResults.length
      );
      
      setAverageSpeed(avgSpeed);
      
      clearInterval(progressInterval);
      setProgress(100);
      
    } catch (err) {
      setError('Error running speed test. Please try again.');
      console.error('Speed test error:', err);
      
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return {
    runTest,
    isRunning,
    progress,
    results,
    averageSpeed,
    error
  };
}