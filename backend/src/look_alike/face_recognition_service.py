# -*- coding: utf-8 -*-

import os
from typing import List, Optional, Tuple

import numpy as np
from config import Config
from deepface import DeepFace
from deepface.modules import verification


class FaceRecognitionService:
    """顔認識サービスクラス"""

    def __init__(self):
        self.known_face_vectors: List[np.ndarray] = []
        self.known_face_filenames: List[str] = []
        self.average_face_vector: Optional[np.ndarray] = None

    def initialize_model(self) -> bool:
        """
        基準画像の顔ベクトルを計算し、その平均ベクトルを生成する

        Returns:
            bool: 初期化が成功した場合True
        """
        print("AIモデルの初期化を開始します...")
        print(f"基準画像フォルダ: {Config.REFERENCE_IMAGES_DIR}")

        if not os.path.isdir(Config.REFERENCE_IMAGES_DIR):
            print(
                f"\n[エラー] 基準画像フォルダが見つかりません: {Config.REFERENCE_IMAGES_DIR}\n"
            )
            return False

        # 各基準画像の顔ベクトルを抽出
        for filename in os.listdir(Config.REFERENCE_IMAGES_DIR):
            if filename.lower().endswith(Config.SUPPORTED_IMAGE_FORMATS):
                success = self._process_reference_image(filename)
                if not success:
                    continue

        # 抽出したベクトルの平均を計算
        if self.known_face_vectors:
            self.average_face_vector = np.mean(
                np.array(self.known_face_vectors), axis=0
            )
            print(
                f"\n合計 {len(self.known_face_vectors)} 個の基準ベクトルから「平均顔」を生成しました。"
            )
            return True
        else:
            print("\n[重要] 有効な基準顔ベクトルがありません。AIは判定できません。\n")
            return False

    def _process_reference_image(self, filename: str) -> bool:
        """
        単一の基準画像を処理してベクトルを抽出する

        Args:
            filename: 処理する画像ファイル名

        Returns:
            bool: 処理が成功した場合True
        """
        image_path = os.path.join(Config.REFERENCE_IMAGES_DIR, filename)
        try:
            embedding_objs = DeepFace.represent(
                img_path=image_path,
                model_name=Config.MODEL_NAME,
                enforce_detection=False,
            )

            if (
                embedding_objs
                and embedding_objs[0]["face_confidence"]
                > Config.FACE_CONFIDENCE_THRESHOLD
            ):
                vector = embedding_objs[0]["embedding"]
                self.known_face_vectors.append(vector)
                self.known_face_filenames.append(filename)
                print(f"  - [成功] {filename} のベクトルを抽出しました。")
                return True
            else:
                print(f"  - [警告] {filename} で顔を検出できませんでした。")
                return False
        except Exception as e:
            print(f"  - [エラー] {filename} の処理中にエラー: {e}")
            return False

    def extract_face_vector(self, image_path: str) -> Optional[np.ndarray]:
        """
        画像から顔ベクトルを抽出する

        Args:
            image_path: 画像ファイルのパス

        Returns:
            np.ndarray or None: 抽出された顔ベクトル、失敗時はNone
        """
        try:
            embedding_objs = DeepFace.represent(
                img_path=image_path,
                model_name=Config.MODEL_NAME,
                enforce_detection=False,
            )

            if (
                embedding_objs
                and embedding_objs[0]["face_confidence"]
                > Config.FACE_CONFIDENCE_THRESHOLD
            ):
                return embedding_objs[0]["embedding"]
            return None
        except Exception:
            return None

    def calculate_similarity(self, user_vector: np.ndarray) -> float:
        """
        ユーザーの顔ベクトルと平均顔との類似度を計算する

        Args:
            user_vector: ユーザーの顔ベクトル

        Returns:
            float: 類似度スコア (0-100)
        """
        if self.average_face_vector is None:
            raise ValueError("平均顔ベクトルが初期化されていません")

        distance = verification.find_cosine_distance(
            user_vector, self.average_face_vector
        )
        print(f"ユーザーの顔ベクトルと平均顔の距離: {distance:.4f}")

        # --- 人間の感覚に合わせたロジスティック関数によるスコアリング ---
        # 距離0.4でスコアが50%になる点を「変曲点」とし、その前後でスコアが急激に変化する
        # S字カーブを描くことで、よりメリハリのある判定を実現
        # kの値でカーブの急さを調整
        similarity = 100 / (
            1
            + np.exp(
                Config.SIMILARITY_K * (distance - Config.SIMILARITY_INFLECTION_POINT)
            )
        )
        return similarity

    def find_best_match(self, user_vector: np.ndarray) -> Tuple[str, float]:
        """
        ユーザーの顔と最も類似した基準画像を見つける

        Args:
            user_vector: ユーザーの顔ベクトル

        Returns:
            Tuple[str, float]: (最適マッチファイル名, 距離)
        """
        if not self.known_face_vectors:
            raise ValueError("基準顔ベクトルが初期化されていません")

        distances = [
            verification.find_cosine_distance(user_vector, vec)
            for vec in self.known_face_vectors
        ]
        best_match_index = np.argmin(distances)
        return self.known_face_filenames[best_match_index], distances[best_match_index]

    def is_initialized(self) -> bool:
        """
        モデルが初期化されているかチェックする

        Returns:
            bool: 初期化済みの場合True
        """
        return self.average_face_vector is not None
