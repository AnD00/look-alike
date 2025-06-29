"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { cn } from '@/app/lib/utils';

interface ImageUploadProps {
    imageUrl: string | null;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onImageRemove: () => void;
    isDisabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
    imageUrl, 
    onImageChange, 
    onImageRemove,
    isDisabled = false 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isDisabled) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        if (isDisabled) return;
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            const event = {
                target: { files }
            } as React.ChangeEvent<HTMLInputElement>;
            onImageChange(event);
        }
    };

    const handleClick = () => {
        if (!isDisabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageRemove();
        setIsImageLoaded(false);
    };

    return (
        <motion.div 
            className="flex flex-col items-center w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                className="text-xl font-semibold mb-4 text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                あなたの写真
            </motion.h2>
            
            <Card className="w-full overflow-hidden">
                <CardContent className="p-0">
                    <motion.div
                        className={cn(
                            "relative aspect-square cursor-pointer transition-all duration-300 border-2 border-dashed",
                            isDragOver && !isDisabled 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50 hover:bg-accent/50",
                            isDisabled && "cursor-not-allowed opacity-50",
                            imageUrl && "border-solid border-transparent"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                        whileHover={!isDisabled ? { scale: 1.02 } : {}}
                        whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    >
                        <AnimatePresence mode="wait">
                            {imageUrl ? (
                                <motion.div
                                    key="image"
                                    className="relative w-full h-full"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt="アップロードされた画像のプレビュー" 
                                        className="w-full h-full object-cover rounded-lg"
                                        onLoad={() => setIsImageLoaded(true)}
                                    />
                                    {!isDisabled && (
                                        <motion.button
                                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                                            onClick={handleRemoveImage}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    )}
                                    {isImageLoaded && (
                                        <motion.div
                                            className="absolute bottom-2 right-2 p-1.5 bg-green-500 text-white rounded-full shadow-lg"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Check size={16} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isDragOver ? (
                                            <Upload size={48} className="mb-4 text-primary" />
                                        ) : (
                                            <Camera size={48} className="mb-4" />
                                        )}
                                    </motion.div>
                                    <motion.p 
                                        className="text-sm text-center font-medium mb-2"
                                        animate={isDragOver ? { color: "hsl(var(--primary))" } : {}}
                                    >
                                        {isDragOver ? "ここにドロップ" : "写真をアップロード"}
                                    </motion.p>
                                    <p className="text-xs text-center text-muted-foreground">
                                        クリックまたはドラッグ&ドロップ
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </CardContent>
            </Card>

            <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onImageChange}
                disabled={isDisabled}
            />
            
            <motion.p 
                className="text-xs text-muted-foreground mt-3 text-center max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                正面を向いた顔が鮮明に写っている写真を選択してください
            </motion.p>
        </motion.div>
    );
};