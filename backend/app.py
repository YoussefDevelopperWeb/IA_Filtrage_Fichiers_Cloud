from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd
from flask_cors import CORS
import uuid

from analysis.static_analysis import analyze_js
from analysis.feature_extraction import extract_features
from utils.supabase_client import supabase

# =========================
# Initialisation Flask
# =========================
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "js_model.pkl")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# Charger le modèle ML
# =========================


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Le modèle ML js_model.pkl est introuvable. "
        "Veuillez entraîner le modèle avec train_model.py"
    )

model = joblib.load(MODEL_PATH)

# =========================
# API Endpoint
# =========================
@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.lower().endswith(".js"):
        return jsonify({"error": "Only JS files allowed"}), 400

    # 🔹 Sauvegarde locale (nom original)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        code = f.read()

    # 1️⃣ Static analysis
    static_result, score = analyze_js(code)

    # 2️⃣ Machine Learning
    features = extract_features(code)
    X = pd.DataFrame([features])
    ml_prediction = model.predict(X)[0]

    # 3️⃣ Malicious → pas d’upload
    if static_result == "malicious" or ml_prediction == 1:
        return jsonify({
            "result": "malicious",
            "static_score": score,
            "ml_prediction": int(ml_prediction),
            "uploaded": False
        })

    # 4️⃣ SAFE → Upload avec nom unique
    try:
        unique_name = f"{uuid.uuid4()}_{file.filename}"

        with open(file_path, "rb") as f:
            supabase.storage.from_("js-files").upload(
                path=unique_name,
                file=f,
                file_options={
                    "content-type": "application/javascript"
                }
            )

        return jsonify({
            "result": "safe",
            "static_score": score,
            "ml_prediction": int(ml_prediction),
            "uploaded": True,
            "stored_as": unique_name
        })

    except Exception as e:
        return jsonify({
            "error": "Upload to Supabase failed",
            "details": str(e)
        }), 500

# =========================
# Run server
# =========================
if __name__ == "__main__":
    app.run(debug=True)
