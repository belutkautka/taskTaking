const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal__title');
const modalText = document.getElementById('modal__text');
const modalButton = document.getElementById('button');

let tasks = new Map();
let takenTasks = new Set();

let taskRequest = sendGetTaskRequest("/tasks/get_tasks_by_teacher_id")
let takenTaskRequest = sendGetTaskRequest("/tasks/get_my_taken_tasks")
    .then(data => data.Data.forEach(e => takenTasks.add(e.task_id)))
taskRequest.then(data => createNewTasks(data.Data));

function createNewTasks(data) {
    data.forEach(e => createNewTask(e.name, `${e.contest_type} ${e.contest_number} ${e.task_number} задача` , e.task_value, e.description, e.id));
}

function createNewTask(tValue, pValue, gValue, dValue, id) {
    let newTask = document.createElement("div");
    newTask.className = "task_table";
    let title = document.createElement("div");
    title.className = "title";
    title.innerHTML = tValue;
    let path = document.createElement("div");
    path.className = "path";
    path.innerHTML = pValue;
    let grade = document.createElement("div");
    grade.className = "grade";
    grade.innerHTML = gValue;
    newTask.append(title, path, grade);
    document.getElementById("titles").append(newTask);
    newTask.addEventListener('click', function (e) {
        modalTitle.innerHTML = tValue;
        modalText.innerHTML = dValue;
        modalButton.innerHTML=takenTasks.has(id)?"Снять задачу":"Взять задачу"
        modal.classList.add('modal_active');
    });
    addTaskToDictionary(tValue,id);
}

function addTaskToDictionary(name, id) {
    tasks.set(name, id);
}


function sendGetTaskRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}
function sendTakeTaskRequest(url, id) {
    return fetch(url+"?task_id="+id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }})
        .then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});

document.querySelector('.button').addEventListener('click', function (e) {
    if (modalButton.innerHTML==="Снять задачу"){
        modalButton.innerHTML = "Взять задачу"
        taskId = tasks.get(modalTitle.innerHTML);
        sendTakeTaskRequest("/tasks/drop_task", taskId);
        takenTasks.delete(taskId)
    }
    else{
    modalButton.innerHTML = "Снять задачу";
    taskId = tasks.get(modalTitle.innerHTML);
    sendTakeTaskRequest("/tasks/take_task",taskId);
    takenTasks.add(taskId)
    }
});