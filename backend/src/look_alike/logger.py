# -*- coding: utf-8 -*-

import logging
import sys
from typing import Optional


def setup_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """
    ロガーを設定する

    Args:
        name: ロガー名
        level: ログレベル

    Returns:
        logging.Logger: 設定されたロガー
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


class ErrorHandler:
    """エラーハンドリングユーティリティクラス"""

    def __init__(self, logger: Optional[logging.Logger] = None):
        self.logger = logger or setup_logger(self.__class__.__name__)

    def log_error(self, message: str, exception: Optional[Exception] = None):
        """
        エラーをログに記録する

        Args:
            message: エラーメッセージ
            exception: 例外オブジェクト（オプション）
        """
        if exception:
            self.logger.error(f"{message}: {str(exception)}", exc_info=True)
        else:
            self.logger.error(message)

    def log_warning(self, message: str):
        """
        警告をログに記録する

        Args:
            message: 警告メッセージ
        """
        self.logger.warning(message)

    def log_info(self, message: str):
        """
        情報をログに記録する

        Args:
            message: 情報メッセージ
        """
        self.logger.info(message)
