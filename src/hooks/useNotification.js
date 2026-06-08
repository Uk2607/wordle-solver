import { useState, useCallback, useRef } from 'react';

export function useNotification() {
    const [notification, setNotification] = useState(null);
    const timerRef = useRef(null);

    const triggerNotification = useCallback((text, type = "info") => {
        // Clear any existing timer to prevent stale callbacks
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setNotification({ text, type });
        timerRef.current = setTimeout(() => {
            setNotification(null);
            timerRef.current = null;
        }, 4500);
    }, []);

    const clearNotification = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setNotification(null);
    }, []);

    return { notification, triggerNotification, clearNotification };
}
