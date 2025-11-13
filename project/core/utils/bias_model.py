# backend/backend/core/utils/bias_model.py
# Content-based bias predictor (TEXT ONLY). No domain/source used at inference.

import re
import joblib
import numpy as np
from pathlib import Path

# Points to: backend/backend/models/bias/bias_sklearn.joblib
MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "bias" / "bias_sklearn.joblib"
LABELS = ["left", "center", "right"]

_model = None

def _load():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model

def _clean(t: str) -> str:
    return re.sub(r"\s+", " ", t or "").strip()

def predict_bias_for_articles(articles):
    """
    articles: [{title, description, content}, ...]
    returns:  [{label, confidence}, ...]
    """
    m = _load()
    texts = [_clean(f"{a.get('title','')}. {a.get('description','')}. {a.get('content','')}") for a in articles]
    if not texts:
        return []
    probas = m.predict_proba(texts)
    preds  = m.predict(texts)
    out = []
    for pvec, plabel in zip(probas, preds):
        out.append({"label": plabel, "confidence": float(np.max(pvec))})
    return out