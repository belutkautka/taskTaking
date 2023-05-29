const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal__title');
const modalText = document.getElementById('modal__text');


let tasks = sendRequest("/tasks/get_tasks_by_teacher_id");

tasks.then(data => createNewTasks(data.Data));

function createNewTasks(data) {
    data.forEach(e => createNewTask(e.name, e.contest_type + " " + e.contest_number, e.task_value,e.description));
}

function createNewTask(tValue, pValue, gValue, dValue) {
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
        modal.classList.add('modal_active');
    });
}

function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    let modal = document.getElementById('modal');
    modal.classList.remove('modal_active');
});