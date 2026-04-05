import pytest
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, recall_score, f1_score

# Para testar basta rodar: pytest test_model.py ou python -m pytest test_model.py -s


def test_model_performance():
    # =============================
    # 1. Carregar modelo
    # =============================
    model = joblib.load("modelo_svm.pkl")

    # =============================
    # 2. Carregar dataset
    # =============================
    df = pd.read_csv("weatherAUS_Original.csv")

    # =============================
    # 3. Pré-processamento igual ao treino
    # =============================
    df = df.dropna(subset=["RainTomorrow"])

    # Remover colunas que você removeu no treino
    cols_to_drop = ["Sunshine", "Cloud3pm", "Cloud9am"]
    df = df.drop(columns=cols_to_drop)

    # Separar X e y
    X = df.drop("RainTomorrow", axis=1)
    y = df["RainTomorrow"].map({"No": 0, "Yes": 1})

    # =============================
    # 4. Criar conjunto de teste fixo
    # =============================
    from sklearn.model_selection import train_test_split

    _, X_test, _, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # =============================
    # 5. Predição
    # =============================
    y_pred = model.predict(X_test)

    # =============================
    # 6. Métricas
    # =============================
    accuracy = accuracy_score(y_test, y_pred)
    recall_chuva = recall_score(y_test, y_pred, pos_label=1)
    f1_chuva = f1_score(y_test, y_pred, pos_label=1)

    print(f"\nAccuracy: {accuracy:.4f}")
    print(f"Recall (chuva): {recall_chuva:.4f}")
    print(f"F1-score (chuva): {f1_chuva:.4f}")

    # =============================
    # 7. Thresholds (critérios)
    # =============================
    assert accuracy >= 0.80, f"Accuracy abaixo do esperado: {accuracy:.4f}"
    assert recall_chuva >= 0.50, f"Recall da chuva abaixo do esperado: {recall_chuva:.4f}"
    assert f1_chuva >= 0.58, f"F1-score da chuva abaixo do esperado: {f1_chuva:.4f}"