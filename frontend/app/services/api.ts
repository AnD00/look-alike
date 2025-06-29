import { ApiCompareResponse } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export const api = {
    async compareFaces(userImageUrl: string): Promise<ApiCompareResponse> {
        const formData = new FormData();
        
        const userResponse = await fetch(userImageUrl);
        const userBlob = await userResponse.blob();
        formData.append('userImage', userBlob, 'user.jpg');

        const response = await fetch(`${API_BASE_URL}/api/compare`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'サーバーでエラーが発生しました');
        }

        return response.json();
    },

    getReferenceImageUrl(filename: string): string {
        return `${API_BASE_URL}/api/reference_image/${filename}`;
    }
};