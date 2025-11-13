from transformers import pipeline

summarizer_pipeline = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")


def summarize_text(text):
    if not text:
        return ""
    
    input_length = len(text.split())


    if input_length < 30:
        return text

    max_length = max(50, int(input_length))
    min_length = max(25, int(max_length))

    summary = summarizer_pipeline(
        text,
        max_length=max_length,
        min_length=min_length,
        do_sample=False
    )
    return summary[0]['summary_text']
