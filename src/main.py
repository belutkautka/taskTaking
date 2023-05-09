from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from src.pages.router import router as router_pages

# uvicorn src.main:app --reload
app = FastAPI()
app.include_router(router_pages)
app.mount("/static", StaticFiles(directory='src/static'), name="static")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
