from fastapi import APIRouter, Request, Depends, Response
from fastapi.templating import Jinja2Templates
from src.auth.base_config import fastapi_users
from fastapi.responses import RedirectResponse
from src.auth.models import User


router = APIRouter(
    prefix="/pages",
    tags=["Pages"]
)

templates = Jinja2Templates(directory="src/templates")
current_user = fastapi_users.current_user()

@router.get("/notifications")
def get_base_page(request: Request, user: User = Depends(current_user)):
    # return RedirectResponse('roleselector', status_code=302)
    return templates.TemplateResponse("notifications.html", {"request": request})


@router.get("/profile")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("profile.html", {"request": request})


@router.get("/startpage")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("startPage.html", {"request": request})


@router.get("/tasks")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("tasks.html", {"request": request})


@router.get("/teachergroup")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("teacherGroup.html", {"request": request})


@router.get("/teacherstartpage")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("teacherStartPage.html", {"request": request})


@router.get("/teachertasks")
def get_base_page(request: Request, user: User = Depends(current_user)):
    return templates.TemplateResponse("teacherTasks.html", {"request": request})


@router.get("/signin")
def get_base_page(request: Request):
    return templates.TemplateResponse("signin.html", {"request": request})


@router.post("/set-dark-theme-cookie")
def get_base_page(response: Response):
    response.set_cookie(key="theme-cookie", value="dark")
    return {"message": "Come to the dark side, we have cookies"}


@router.post("/set-light-theme-cookie")
def get_base_page(response: Response):
    response.set_cookie(key="theme-cookie", value="light")
    return {"message": "Come to the light side, we have cookies too"}
