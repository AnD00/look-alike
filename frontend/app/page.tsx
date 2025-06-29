"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { ResultDisplay } from '@/app/components/ResultDisplay';
import { ImageUpload } from '@/app/components/ImageUpload';
import { JudgeButton } from '@/app/components/JudgeButton';
import { Card, CardContent } from '@/app/components/ui/Card';
import { useImageUpload } from '@/app/hooks/useImageUpload';
import { useFaceComparison } from '@/app/hooks/useFaceComparison';

export default function Home() {
    const { imageUrl, handleImageChange, resetImage } = useImageUpload();
    const { status, score, comment, matchedImageUrl, judge, reset } = useFaceComparison();

    const handleJudge = async (onProgressComplete: () => void) => {
        if (!imageUrl) {
            // より良いユーザーエクスペリエンスのためのアラート改善
            const alertDiv = document.createElement('div');
            alertDiv.className = 'fixed top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50';
            alertDiv.textContent = 'あなたの写真をアップロードしてください';
            document.body.appendChild(alertDiv);
            setTimeout(() => document.body.removeChild(alertDiv), 3000);
            return;
        }
        await judge(imageUrl, onProgressComplete);
    };

    const handleReset = () => {
        resetImage();
        reset();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* ヘッダー */}
                <motion.header 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="flex items-center justify-center gap-3 mb-4"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatDelay: 5 
                            }}
                        >
                            <Sparkles className="text-primary" size={32} />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            顔面そっくり度判定
                        </h1>
                        <motion.div
                            animate={{ 
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatDelay: 5,
                                delay: 0.5
                            }}
                        >
                            <Sparkles className="text-primary" size={32} />
                        </motion.div>
                    </motion.div>
                    <motion.p 
                        className="text-lg text-muted-foreground font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        AIがあなたの顔の特徴を分析し、類似度を判定します
                    </motion.p>
                </motion.header>

                {/* メインコンテンツ */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/50">
                        <CardContent className="p-8">
                            <AnimatePresence mode="wait">
                                {status === 'result' ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ResultDisplay 
                                            score={score} 
                                            comment={comment} 
                                            userImage={imageUrl} 
                                            matchedImage={matchedImageUrl} 
                                            onReset={handleReset} 
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        className="flex flex-col items-center space-y-8"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ImageUpload 
                                            imageUrl={imageUrl}
                                            onImageChange={handleImageChange}
                                            onImageRemove={resetImage}
                                            isDisabled={status === 'judging'}
                                        />
                                        <JudgeButton 
                                            onClick={handleJudge}
                                            isJudging={status === 'judging'}
                                            isDisabled={status === 'judging' || !imageUrl}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.main>

                {/* フッター（注意事項） */}
                <motion.footer 
                    className="mt-12 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Card className="bg-accent/30 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-orange-500 mt-1 flex-shrink-0" size={18} />
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-semibold text-foreground mb-2">
                                        重要な注意事項
                                    </p>
                                    <p className="mb-2">
                                        このアプリケーションはエンターテイメント目的のものです。
                                        結果はAIによるものであり、正確性を保証するものではありません。
                                    </p>
                                    <p>
                                        画像の取り扱いには十分ご注意ください。
                                        特に、許可なく他人の画像をアップロードすることはおやめください。
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Shield className="text-primary mt-1 flex-shrink-0" size={18} />
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-semibold text-foreground mb-1">
                                        プライバシー保護
                                    </p>
                                    <p>
                                        アップロードされた画像は処理後、即座にサーバーから削除されます。
                                        お客様のプライバシーを最優先に考えています。
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.footer>
            </div>
        </div>
    );
}