import { useState, useEffect, useRef, useCallback } from 'react';
import { authApi, wordsApi } from '../utils/api.js';
import { GOOGLE_CLIENT_ID } from '../utils/constants.js';

export function useAuth(triggerNotification) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [customDictionary, setCustomDictionary] = useState([]);
    const googleBtnRef = useRef(null);

    const isLoggedIn = !!user;

    // Fetch custom words from DB
    const fetchCustomWords = useCallback(async () => {
        try {
            const words = await wordsApi.fetchAll();
            setCustomDictionary(words);
        } catch {
            // Silent fail
        }
    }, []);

    // Google sign-in callback
    const handleGoogleCallback = useCallback(async (response) => {
        try {
            const data = await authApi.googleSignIn(response.credential);
            setUser(data.user);

            if (data.isNewUser) {
                triggerNotification(`Welcome, ${data.user.name}! \u{1F389} You've received ${data.user.credits} free AI credits.`, "success");
            } else {
                triggerNotification(`Welcome back, ${data.user.name}! You have ${data.user.credits} AI credits.`, "success");
            }

            // Fetch custom dictionary
            fetchCustomWords();
        } catch (err) {
            console.error('Google sign-in error:', err);
            triggerNotification("Google sign-in failed. Please try again.", "error");
        }
    }, [triggerNotification, fetchCustomWords]);

    // Session restore on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const restoredUser = await authApi.restoreSession();
                if (restoredUser) {
                    setUser(restoredUser);
                    fetchCustomWords();
                }
            } catch {
                // No valid session
            } finally {
                setAuthLoading(false);
            }
        };
        restoreSession();
    }, [fetchCustomWords]);

    // Initialize Google Sign-In button
    useEffect(() => {
        if (authLoading) return;
        if (user) return;

        const initGSI = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                if (googleBtnRef.current) {
                    window.google.accounts.id.renderButton(googleBtnRef.current, {
                        type: 'standard',
                        theme: 'filled_black',
                        size: 'medium',
                        text: 'signin_with',
                        shape: 'pill',
                        logo_alignment: 'left',
                    });
                }
            }
        };

        if (window.google?.accounts?.id) {
            initGSI();
        } else {
            const checkInterval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(checkInterval);
                    initGSI();
                }
            }, 200);
            return () => clearInterval(checkInterval);
        }
    }, [authLoading, user, handleGoogleCallback]);

    // Sign out
    const handleSignOut = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Continue with local logout
        }

        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }

        setUser(null);
        setCustomDictionary([]);
        triggerNotification("Logged out successfully. AI Solver requires an active account.", "info");
    }, [triggerNotification]);

    // Update user data (used by credit deduction/purchase)
    const updateUser = useCallback((updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    return {
        user,
        isLoggedIn,
        authLoading,
        googleBtnRef,
        customDictionary,
        setCustomDictionary,
        handleSignOut,
        updateUser,
        fetchCustomWords,
    };
}
