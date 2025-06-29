# -*- coding: utf-8 -*-

from config import Config
from face_recognition_service import FaceRecognitionService
from flask import Blueprint, jsonify, request, send_from_directory
from image_utils import ImageProcessor

api = Blueprint("api", __name__)

# グローバル顔認識サービスインスタンス
face_service = FaceRecognitionService()


@api.route("/reference_image/<path:filename>")
def get_reference_image(filename):
    """基準画像を配信するエンドポイント"""
    return send_from_directory(Config.REFERENCE_IMAGES_DIR, filename)


@api.route("/compare", methods=["POST"])
def compare_faces():
    """顔比較APIエンドポイント"""

    # モデル初期化チェック
    if not face_service.is_initialized():
        return jsonify({"error": "サーバー側のAIモデルが初期化されていません。"}), 500

    # ファイル存在チェック
    if "userImage" not in request.files:
        return jsonify({"error": "画像ファイルが見つかりません"}), 400

    user_file = request.files["userImage"]

    # 一時ファイル保存
    temp_image_path = ImageProcessor.save_temp_image(user_file)
    if not temp_image_path:
        return jsonify({"error": "画像ファイルの保存に失敗しました"}), 500

    try:
        # 顔ベクトル抽出
        user_vector = face_service.extract_face_vector(temp_image_path)
        if user_vector is None:
            return jsonify({"error": "あなたの画像で顔を検出できませんでした。"}), 400

        # 類似度計算
        similarity = face_service.calculate_similarity(user_vector)

        # 最適マッチング画像の選定
        best_match_filename, _ = face_service.find_best_match(user_vector)

        return jsonify(
            {
                "similarity": round(similarity, 2),
                "best_match_filename": best_match_filename,
            }
        )

    except Exception as e:
        return jsonify({"error": f"画像の解析中にエラーが発生しました: {e}"}), 400
    finally:
        # 一時ファイルのクリーンアップ
        ImageProcessor.cleanup_temp_image(temp_image_path)


def initialize_face_service():
    """顔認識サービスを初期化する"""
    return face_service.initialize_model()
