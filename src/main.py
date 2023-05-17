from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.staticfiles import StaticFiles
from src.pages.router import router as router_pages

# uvicorn src.main:app --reload
app = FastAPI(
    title='TaskTaking'
)
app.include_router(router_pages)
app.mount("/static", StaticFiles(directory='src/static'), name="static")


@app.get("/")
async def root():
    return RedirectResponse('pages/startpage', status_code=302)
