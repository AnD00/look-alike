"use client";

import { useState, useCallback } from 'react';

export const useImageUpload = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            const newUrl = URL.createObjectURL(file);
            setImageUrl(newUrl);
        }
    }, [imageUrl]);

    const resetImage = useCallback(() => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(null);
        
        const input = document.getElementById('user-image-upload') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    }, [imageUrl]);

    return {
        imageUrl,
        handleImageChange,
        resetImage
    };
};