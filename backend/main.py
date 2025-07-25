from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import shutil
import time
import os



app = FastAPI()



# AssemblyAI API key (only for audio)
API_KEY = '5d8d89d0b1c74d3c92ab8ce0840e35b8'
headers = {'authorization': API_KEY}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------- AUDIO FUNCTIONS -------------------------

def upload_audio_to_assemblyai(file_path):
    with open(file_path, 'rb') as f:
        response = requests.post(
            'https://api.assemblyai.com/v2/upload',
            headers=headers,
            files={'file': f}
        )
    return response.json()['upload_url']

def start_transcription(audio_url):
    endpoint = "https://api.assemblyai.com/v2/transcript"
    json_data = {
        "audio_url": audio_url,
        "speaker_labels": True,
        "auto_chapters": True,
        "iab_categories": True,
        "auto_highlights": True
    }
    response = requests.post(endpoint, json=json_data, headers=headers)
    return response.json()['id']

def get_transcription_result(transcript_id):
    polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    while True:
        response = requests.get(polling_endpoint, headers=headers)
        data = response.json()
        if data['status'] == 'completed':
            return data
        elif data['status'] == 'error':
            raise RuntimeError(data['error'])
        time.sleep(3)

# ------------------------- MAIN ROUTE -------------------------

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        filename = file.filename
        extension = filename.split(".")[-1].lower()

        # ---------- AUDIO ----------
        if extension in ["mp3", "wav", "m4a"]:
            temp_filename = "temp_audio." + extension
            with open(temp_filename, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            audio_url = upload_audio_to_assemblyai(temp_filename)
            transcript_id = start_transcription(audio_url)
            result = get_transcription_result(transcript_id)

            os.remove(temp_filename)

            transcript = ""
            utterances = result.get("utterances")
            if utterances:
                for utterance in utterances:
                    transcript += f"{utterance['speaker']}: {utterance['text']}\n"
            else:
                transcript = result.get("text", "Transcription not available.")

            summary = result.get("chapters") or []

            return JSONResponse(content={
                "type": "audio",
                "transcript": transcript,
                "summary": summary
            })

        # ---------- TEXT ----------
        elif extension == "txt":
            content = await file.read()
            text = content.decode("utf-8")

            print("📝 Uploaded text:", text[:100])

            # Limit text size (Huggingface has ~1024 token limit)
            if len(text) > 3000:
                text = text[:3000]

            #lazy import for transformers
            # For text summarization
            from transformers import pipeline
            # Summarizer model initialization (once, during startup)
            summarizer = pipeline(
                "summarization",
                model="sshleifer/distilbart-cnn-12-6",  # ✅ Lighter model
                device=-1  # ✅ Force CPU (no GPU, avoids mps crash)
            )
            summary_output = summarizer(text, max_length=150, min_length=30, do_sample=False)

            print("📄 Summary Output:", summary_output)
            summary_text = summary_output[0]['summary_text']

            # Convert to same structure as audio summary (list of one chunk)
            summary = [{
                "summary": summary_text,
                "headline": "Summary",
                "gist": "Main idea",
                "start": 0,
                "end": 0
            }]

            return JSONResponse(content={
                "type": "text",
                "transcript": text,
                "summary": summary
            })

        # ---------- INVALID FILE ----------
        else:
            return JSONResponse(status_code=400, content={"error": "Unsupported file type. Upload .mp3, .wav, .m4a or .txt"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Error during transcription: {str(e)}"}) 

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))  # use Render's PORT env if available
    uvicorn.run("main:app", host="0.0.0.0", port=port)
