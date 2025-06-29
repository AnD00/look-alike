"use client";

import { useState, useCallback } from 'react';
import { AppStatus } from '@/app/types';
import { api } from '@/app/services/api';
import { getCommentByScore } from '@/app/utils/score';

export const useFaceComparison = () => {
    const [status, setStatus] = useState<AppStatus>('idle');
    const [score, setScore] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [matchedImageUrl, setMatchedImageUrl] = useState<string | null>(null);

    const judge = useCallback(async (userImageUrl: string, onProgressComplete?: () => void) => {
        setStatus('judging');
        
        try {
            const result = await api.compareFaces(userImageUrl);
            const newScore = result.similarity;
            
            // プログレスが完了してから結果を表示
            if (onProgressComplete) {
                onProgressComplete();
            }
            
            // 少し遅延を入れて結果を表示
            setTimeout(() => {
                setScore(newScore);
                setComment(getCommentByScore(newScore));
                
                if (result.best_match_filename) {
                    setMatchedImageUrl(api.getReferenceImageUrl(result.best_match_filename));
                }
                
                setStatus('result');
            }, 300);
            
        } catch (error) {
            if (error instanceof Error) {
                alert(`エラーが発生しました: ${error.message}`);
            } else {
                alert('エラーが発生しました: 不明なエラー');
            }
            setStatus('idle');
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setScore(0);
        setComment('');
        setMatchedImageUrl(null);
    }, []);

    return {
        status,
        score,
        comment,
        matchedImageUrl,
        judge,
        reset
    };
};