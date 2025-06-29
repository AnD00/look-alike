# -*- coding: utf-8 -*-

import os
import tempfile
from typing import Optional

from config import Config
from werkzeug.datastructures import FileStorage


class ImageProcessor:
    """画像処理ユーティリティクラス"""

    @staticmethod
    def save_temp_image(file: FileStorage) -> Optional[str]:
        """
        アップロードされたファイルを一時保存する

        Args:
            file: アップロードされたファイル

        Returns:
            str or None: 保存されたファイルパス、失敗時はNone
        """
        try:
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, Config.TEMP_IMAGE_NAME)
            file.save(temp_path)
            return temp_path
        except Exception:
            return None

    @staticmethod
    def cleanup_temp_image(file_path: str) -> bool:
        """
        一時ファイルを削除する

        Args:
            file_path: 削除するファイルのパス

        Returns:
            bool: 削除が成功した場合True
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False

    @staticmethod
    def is_supported_format(filename: str) -> bool:
        """
        サポートされている画像形式かチェックする

        Args:
            filename: チェックするファイル名

        Returns:
            bool: サポートされている場合True
        """
        return filename.lower().endswith(Config.SUPPORTED_IMAGE_FORMATS)
