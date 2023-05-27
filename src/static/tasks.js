// document.querySelector('.task_table').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.add('modal_active');
// });
// document.querySelector('.modal__close-button').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.remove('modal_active');
// })
let tasks = sendRequest("/tasks/get_tasks_by_teacher_id");

tasks.then(data => createNewTasks(data.Data));

function createNewTasks(data) {
    data.forEach(e => createNewTask(e.name, e.contest_type + " " + e.contest_number, e.task_value));
}

function createNewTask(tValue, pValue, gValue) {
    let newTask = document.createElement("div");
    newTask.className = "task_table";
    let title = document.createElement("div")
    title.className = "title"
    title.innerHTML = tValue
    let path = document.createElement("div")
    path.className = "path"
    path.innerHTML = pValue
    let grade = document.createElement("div")
    grade.className = "grade"
    grade.innerHTML = gValue
    newTask.append(title, path, grade)
    document.getElementById("titles").append(newTask)
}

function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}