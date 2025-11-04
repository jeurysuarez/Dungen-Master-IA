import { useState, useEffect } from 'react';

type ApiStatus = 'idle' | 'checking' | 'ok' | 'error';

const API_CHECK_INTERVAL = 60 * 1000; // 60 seconds

export const useApiStatus = (): { apiStatus: ApiStatus } => {
    const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');

    const checkStatus = async () => {
        // Don't set to checking if the status is already ok, to avoid flickering
        if (apiStatus !== 'ok') {
            setApiStatus('checking');
        }
        
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                setApiStatus('ok');
            } else {
                setApiStatus('error');
            }
        } catch (error) {
            console.error("API health check failed:", error);
            setApiStatus('error');
        }
    };

    // Initial check on mount
    useEffect(() => {
        checkStatus();
    }, []);

    // Periodic check
    useEffect(() => {
        const intervalId = setInterval(checkStatus, API_CHECK_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    return { apiStatus };
};
