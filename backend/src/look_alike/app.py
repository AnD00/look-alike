# -*- coding: utf-8 -*-

from config import Config
from flask import Flask
from flask_cors import CORS
from logger import setup_logger
from routes import api, initialize_face_service

# ロガー設定
logger = setup_logger(__name__)

# Flaskアプリケーション作成
app = Flask(__name__)
CORS(app)

# APIブループリントを登録
app.register_blueprint(api, url_prefix="/api")


def create_app():
    """
    アプリケーションファクトリ関数

    Returns:
        Flask: 設定済みのFlaskアプリケーション
    """
    logger.info("アプリケーションを初期化しています...")

    # AIモデルの初期化
    if initialize_face_service():
        logger.info("AIモデルの初期化が完了しました")
    else:
        logger.error("AIモデルの初期化に失敗しました")

    return app


if __name__ == "__main__":
    # 開発サーバーとして実行
    application = create_app()
    logger.info(f"サーバーを {Config.HOST}:{Config.PORT} で起動します...")
    application.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
