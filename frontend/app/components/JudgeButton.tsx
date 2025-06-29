"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface JudgeButtonProps {
    onClick: (onProgressComplete: () => void) => void;
    isJudging: boolean;
    isDisabled: boolean;
}

export const JudgeButton: React.FC<JudgeButtonProps> = ({ 
    onClick, 
    isJudging, 
    isDisabled 
}) => {
    const handleClick = () => {
        onClick(() => {});
    };

    return (
        <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Button
                onClick={handleClick}
                disabled={isDisabled}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-[200px]"
            >
                <AnimatePresence mode="wait">
                    {isJudging ? (
                        <motion.div
                            key="judging"
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 size={20} />
                            </motion.div>
                            判定中...
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ready"
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    repeatDelay: 3 
                                }}
                            >
                                <Sparkles size={20} />
                            </motion.div>
                            そっくり度を判定！
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* グラデーションアニメーション */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                    }}
                />
            </Button>
            
            <AnimatePresence>
                {isJudging && (
                    <motion.div
                        className="mt-6 space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="flex items-center justify-center gap-2 text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    color: ['#6B7280', '#8B5CF6', '#6B7280']
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Brain size={18} />
                            </motion.div>
                            <span className="text-sm font-medium">
                                AIが顔の特徴を分析しています...
                            </span>
                        </motion.div>
                        
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};