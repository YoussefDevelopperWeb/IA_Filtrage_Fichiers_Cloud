import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# =========================
# Charger le dataset
# =========================

DATASET_PATH = "../../dataset/js_dataset.csv"

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError("Dataset js_dataset.csv introuvable")

df = pd.read_csv(DATASET_PATH)

# =========================
# Séparer features / label
# =========================
X = df.drop("label", axis=1) 
y = df["label"] 

# =========================
# Split train / test
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# =========================
# Entraîner le modèle
# =========================

model = DecisionTreeClassifier(
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

# =========================
# Évaluer le modèle
# =========================

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# =========================
# Sauvegarder le modèle
# =========================
                                                                                                 
MODEL_PATH = "js_model.pkl"
joblib.dump(model, MODEL_PATH)

print(f"\n✅ Modèle entraîné et sauvegardé sous {MODEL_PATH}")

                                                                                                      # FastAPI



