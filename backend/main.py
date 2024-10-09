from model import model_pipeline

from typing import Union

from fastapi import FastAPI, UploadFile, File, Form

from fastapi.middleware.cors import CORSMiddleware


from PIL import Image
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/ask")
def ask(text:str = Form(...), image: UploadFile = File(...)):
    image = Image.open(image.file)

    result = model_pipeline(text, image)
    return {"answer": result}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)