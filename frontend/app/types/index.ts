export interface ResultDisplayProps {
    score: number;
    comment: string;
    userImage: string | null;
    matchedImage: string | null;
    onReset: () => void;
}

export type AppStatus = 'idle' | 'judging' | 'result';

export interface ApiCompareResponse {
    similarity: number;
    best_match_filename?: string;
    error?: string;
}