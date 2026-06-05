import { useState, useCallback } from 'react';

export function useNotification() {
    const [notification, setNotification] = useState(null);

    const triggerNotification = useCallback((text, type = "info") => {
        setNotification({ text, type });
        setTimeout(() => {
            setNotification(null);
        }, 4500);
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return { notification, triggerNotification, clearNotification };
}
