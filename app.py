from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)
model = joblib.load("modelo_svm.pkl")

@app.route("/predict", methods=["POST"])
def predict():

    required_fields = [
    "Date", "Location", "MinTemp", "MaxTemp", "Rainfall", "Evaporation",
    "WindGustDir", "WindGustSpeed", "WindDir9am", "WindDir3pm",
    "WindSpeed9am", "WindSpeed3pm", "Humidity9am", "Humidity3pm",
    "Pressure9am", "Pressure3pm", "Temp9am", "Temp3pm", "RainToday"]
    
    data = request.get_json()

    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({
            "error": "Campos ausentes",
            "missing_fields": missing_fields
        }), 400


    df_input = pd.DataFrame([data])

    pred = model.predict(df_input)

    result = "Vai chover amanhã" if int(pred[0]) == 1 else "Não vai chover amanhã"

    return jsonify({
    "prediction": "Vai chover amanhã" if int(pred[0]) == 1 else "Não vai chover amanhã",
    "message": "Predição executada com sucesso."
})