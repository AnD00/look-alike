"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, RotateCcw, Sparkles, Award, Heart } from 'lucide-react';
import { ResultDisplayProps } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    score, 
    comment, 
    userImage, 
    matchedImage, 
    onReset 
}) => {
    const [progress, setProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(score);
            if (score >= 80) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [score]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-yellow-400 to-orange-500';
        if (score >= 40) return 'from-orange-400 to-red-500';
        return 'from-red-400 to-pink-500';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 80) return <Trophy className="text-yellow-500" size={24} />;
        if (score >= 60) return <Award className="text-orange-500" size={24} />;
        if (score >= 40) return <Star className="text-blue-500" size={24} />;
        return <Heart className="text-pink-500" size={24} />;
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return '驚異的な類似度！';
        if (score >= 80) return '非常に高い類似度！';
        if (score >= 70) return 'かなり似ています！';
        if (score >= 60) return 'そこそこ似ています';
        if (score >= 40) return 'ちょっと似ているかも';
        return 'あまり似ていません';
    };

    return (
        <motion.div 
            className="w-full text-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* 画像比較セクション */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="overflow-hidden shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-foreground">
                                あなたの写真
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                {userImage && (
                                    <motion.img
                                        src={userImage}
                                        alt="あなたの画像"
                                        className="w-full h-full object-cover"
                                        initial={{ scale: 1.1, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="overflow-hidden shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-foreground">
                                最も似ていた基準画像
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <AnimatePresence>
                                    {matchedImage ? (
                                        <motion.img
                                            src={matchedImage}
                                            alt="最も似ていた基準画像"
                                            className="w-full h-full object-cover"
                                            initial={{ scale: 1.1, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    ) : (
                                        <motion.div
                                            className="w-full h-full flex items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="animate-pulse text-muted-foreground">
                                                読み込み中...
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* 結果表示セクション */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Card className="shadow-xl bg-gradient-to-br from-card via-card to-accent/10">
                    <CardHeader className="text-center pb-6">
                        <motion.div
                            className="flex items-center justify-center gap-3 mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                        >
                            {getScoreIcon(score)}
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                判定結果
                            </CardTitle>
                            {getScoreIcon(score)}
                        </motion.div>
                        <motion.p
                            className="text-lg font-semibold text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {getScoreMessage(score)}
                        </motion.p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* スコアバー */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    類似度
                                </span>
                                <motion.span
                                    className="text-2xl font-bold text-foreground"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2, type: "spring" }}
                                >
                                    {score}%
                                </motion.span>
                            </div>
                            
                            <div className="w-full bg-secondary rounded-full h-4 overflow-hidden shadow-inner">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${getScoreColor(score)} flex items-center justify-end pr-2 shadow-sm`}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ 
                                        duration: 1.5, 
                                        delay: 1,
                                        ease: "easeOut"
                                    }}
                                >
                                    {progress > 15 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 2 }}
                                        >
                                            <Sparkles size={16} className="text-white" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* コメント */}
                        <AnimatePresence>
                            {comment && (
                                <motion.div
                                    className="bg-accent/50 rounded-lg p-4 border border-border/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.2 }}
                                >
                                    <motion.p
                                        className="text-lg font-medium text-foreground italic"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.4 }}
                                    >
                                        「{comment}」
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* リセットボタン */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.6 }}
                        >
                            <Button
                                onClick={onReset}
                                variant="outline"
                                size="lg"
                                className="mt-4 font-semibold"
                            >
                                <RotateCcw size={18} className="mr-2" />
                                もう一度試す
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 紙吹雪エフェクト */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: -10,
                                    rotate: 0,
                                }}
                                animate={{
                                    y: window.innerHeight + 10,
                                    rotate: 360,
                                    opacity: [1, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: Math.random() * 0.5,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};