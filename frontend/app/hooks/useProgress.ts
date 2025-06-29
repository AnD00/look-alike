"use client";

import { useState, useCallback } from 'react';

export const useProgress = () => {
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const startProgress = useCallback((duration: number = 3000) => {
        setProgress(0);
        setIsActive(true);
        
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            
            setProgress(newProgress);
            
            if (newProgress >= 100) {
                clearInterval(interval);
                setIsActive(false);
            }
        }, 50);

        return () => {
            clearInterval(interval);
            setIsActive(false);
        };
    }, []);

    const resetProgress = useCallback(() => {
        setProgress(0);
        setIsActive(false);
    }, []);

    const completeProgress = useCallback(() => {
        setProgress(100);
        setIsActive(false);
    }, []);

    return {
        progress,
        isActive,
        startProgress,
        resetProgress,
        completeProgress
    };
};