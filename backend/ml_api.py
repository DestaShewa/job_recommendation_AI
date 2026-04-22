from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

# Verify if models are placed before loading
MODEL_PATH = "model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"

model = None
vectorizer = None

if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    try:
        model = pickle.load(open(MODEL_PATH, "rb"))
        vectorizer = pickle.load(open(VECTORIZER_PATH, "rb"))
        print("✅ Models loaded successfully!")
    except Exception as e:
        print(f"⚠️ Error loading models: {e}")
else:
    print("⚠️ WARNING: model.pkl or vectorizer.pkl not found! Please place them in the backend folder (Step 3).")

@app.route("/predict", methods=["POST"])
def predict():
    # If the user hasn't successfully placed the pickle files, fallback gracefully to mock logic
    data = request.json.get("skills", "")
    result = None
    if model and vectorizer:
        try:
            vec = vectorizer.transform([data])
            result = model.predict(vec)[0]
        except ValueError as e:
            print(f"⚠️ Mismatched PKL files detected! ({e})")
            print("Falling back to heuristic evaluation.")
            
    if result is None:
        # Fallback if no PKL exists yet or if there's a dimension mismatch
        lower_data = data.lower()
        if "data" in lower_data or "machine learning" in lower_data or "python" in lower_data:
            result = "Data Scientist"
        elif "react" in lower_data or "node" in lower_data:
            result = "Full Stack Developer"
        else:
            result = "Software Engineer"

    return jsonify({"job": result})

if __name__ == '__main__':
    # Run on 5001 as required
    app.run(port=5001)
