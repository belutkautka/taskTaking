from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

router = APIRouter(
    prefix="/pages",
    tags=["Pages"]
)

templates = Jinja2Templates(directory="src/templates")


@router.get("/notifications")
def get_base_page(request: Request):
    return templates.TemplateResponse("notifications.html", {"request": request})


@router.get("/profile")
def get_base_page(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})


@router.get("/startpage")
def get_base_page(request: Request):
    return templates.TemplateResponse("startPage.html", {"request": request})


@router.get("/tasks")
def get_base_page(request: Request):
    return templates.TemplateResponse("tasks.html", {"request": request})

@router.get("/teacherGroup")
def get_base_page(request: Request):
    return templates.TemplateResponse("tasks.html", {"request": request})


@router.get("/teacherStartPage")
def get_base_page(request: Request):
    return templates.TemplateResponse("tasks.html", {"request": request})


@router.get("/teacherTasks")
def get_base_page(request: Request):
    return templates.TemplateResponse("tasks.html", {"request": request})
