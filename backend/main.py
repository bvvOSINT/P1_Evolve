from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai  
import os

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class AnalysisRequest(BaseModel):
    content: str

@app.post("/analyze")
async def analyze_content(request: AnalysisRequest):
    try:
        prompt = f"""
        Actúa como un experto en ciberseguridad senior especializado en análisis de phishing.
        Analiza el siguiente contenido (puede ser una URL o el texto de un email):
        
        "{request.content}"
        
        Determina si es un intento de phishing. Responde EXCLUSIVAMENTE en español con el siguiente formato:
        VERDICTO: [Seguro / Sospechoso / Phishing Malicioso]
        NIVEL DE RIESGO: [0 a 100]%
        JUSTIFICACIÓN:
        - [Razón técnica 1]
        - [Razón técnica 2]
        - [Razón técnica 3]
        """
        
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        if response and response.text:
            return {"analysis": response.text}
        else:
            raise Exception("La IA devolvió una respuesta vacía.")
            
    except Exception as e:
        print("\n=== ERROR DETECTADO EN EL CEREBRO DE LA IA ===")
        print(str(e))
        print("==============================================\n")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)