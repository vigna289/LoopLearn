import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from huggingface_hub import InferenceClient

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise Exception("HF_TOKEN not found in environment variables")

hf_client = InferenceClient(api_key=HF_TOKEN)

@api_view(["POST"])
def ai_help(request):
    question = request.data.get("question")

    if not question:
        return Response({"error": "Question is required"}, status=400)

    try:
        result = hf_client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant for SkillBarter. Answer questions about skills, learning, careers, and platform usage. Keep answers short."
                },
                {"role": "user", "content": question}
            ],
        )

        answer = result.choices[0].message["content"]
        return Response({"answer": answer})

    except Exception as e:
        print("AI ERROR:", e)   # 👈 VERY IMPORTANT
        return Response({"error": "AI failed"}, status=500)
