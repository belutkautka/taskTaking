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


@router.get("/teachergroup")
def get_base_page(request: Request):
    return templates.TemplateResponse("teacherGroup.html", {"request": request})


@router.get("/teacherstartpage")
def get_base_page(request: Request):
    return templates.TemplateResponse("teacherStartPage.html", {"request": request})


@router.get("/teachertasks")
def get_base_page(request: Request):
    return templates.TemplateResponse("teacherTasks.html", {"request": request})


@router.get("/roleselector")
def get_base_page(request: Request):
    return templates.TemplateResponse("roleselector.html", {"request": request})


@router.get("/studentregistration")
def get_base_page(request: Request):
    return templates.TemplateResponse("studentregistration.html", {"request": request})


@router.get("/teacherregistration")
def get_base_page(request: Request):
    return templates.TemplateResponse("teacherregistration.html", {"request": request})
