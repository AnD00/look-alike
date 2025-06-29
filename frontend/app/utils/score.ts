export const getCommentByScore = (score: number): string => {
    if (score > 90) return 'これはもう、ご本人と言っても過言ではありません！';
    if (score > 75) return 'かなり似ています！街で会ったら二度見しますね。';
    if (score > 60) return '特徴を捉えていますね！雰囲気あります。';
    if (score > 40) return 'まあまあ似ていますが、もう少し頑張りましょう！';
    if (score > 20) return 'うーん、似ている部分もありますが、まだまだですね。';
    return '似ているとは言い難いですが、個性があります！';
};