# -*- coding: utf-8 -*-

import os


class Config:
    """アプリケーション設定クラス"""

    # サーバー設定
    HOST = "0.0.0.0"
    PORT = 5001
    DEBUG = False

    # AIモデル設定
    MODEL_NAME = "Facenet"
    SIMILARITY_INFLECTION_POINT = 0.4
    SIMILARITY_K = 22
    FACE_CONFIDENCE_THRESHOLD = 0

    # パス設定
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    REFERENCE_IMAGES_DIR = os.path.join(SCRIPT_DIR, "images")

    # ファイル形式設定
    SUPPORTED_IMAGE_FORMATS = (".jpg", ".png", ".jpeg")
    TEMP_IMAGE_NAME = "user_temp_image.jpg"
