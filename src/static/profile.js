const takenTasks = document.getElementById("taken")
const acceptedTasks = document.getElementById("accepted")
let uncheckedTask = new Set();

sendGetRequest("/users/me").then(data => {
    document.getElementsByClassName('page_title')[0].innerHTML = data.username;
    document.getElementsByClassName('person_score')[0].innerHTML = data.score_sum;
})
sendGetRequest("/tasks/get_unchecked_task").then(data=> data.Data.forEach(e => uncheckedTask.add(e.id)))
    .then(e=> sendGetRequest("/tasks/get_my_taken_tasks").then(data => data.Data.forEach(e => createTask(e))));

function createTask(task) {
    let newTakenTask = document.createElement("tr");
    let name = document.createElement("td");
    if (uncheckedTask.has(task.id))
        name.innerHTML = `<img id="circle" src="../static/img/circle.png" class="circle_tr"" alt="Круг">${task.name}`;
    else
        name.innerHTML = task.name
    let score = document.createElement("td");
    if (task.score === 0) {
        score.innerHTML = `?/${task.task_value}`;
        newTakenTask.append(name, score);
        takenTasks.append(newTakenTask);
    } else {
        score.innerHTML = `${task.score}/${task.task_value}`;
        newTakenTask.append(name, score);
        acceptedTasks.append(newTakenTask);
    }
}

function sendGetRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}