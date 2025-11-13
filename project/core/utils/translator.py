from transformers import pipeline


LANG_MODEL_MAP = {
    "hi": "Helsinki-NLP/opus-mt-en-hi",
    "fr": "Helsinki-NLP/opus-mt-en-fr",
    "de": "Helsinki-NLP/opus-mt-en-de",
    "es": "Helsinki-NLP/opus-mt-en-es",
    "zh": "Helsinki-NLP/opus-mt-en-zh",
    "en": None, 
}


pipeline_cache = {}

def translate_text(text: str, target_lang: str) -> str:
    if target_lang == "en":
        return text 

    model_name = LANG_MODEL_MAP.get(target_lang)
    if not model_name:
        return f"Unsupported language: {target_lang}"

    try:
        if target_lang not in pipeline_cache:
            pipeline_cache[target_lang] = pipeline("translation_en_to_" + target_lang, model=model_name)
        translator = pipeline_cache[target_lang]
        result = translator(text, max_length=512)
        return result[0]["translation_text"]
    except Exception as e:
        return f"Translation failed: {e}"
