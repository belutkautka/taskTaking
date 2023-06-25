const modal = document.getElementById('modal_form');
const name = document.getElementById('modal_form');
const form = document.forms.add;
const tasks = document.getElementById("tasks")

sendGetTaskRequest("/tasks/get_tasks_by_teacher_id").then(data => data.Data.forEach(e => makeTask(e)))

document.getElementById('modal_form__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});
document.getElementById('add_task_button').addEventListener('click', function (e) {
    modal.classList.add('modal_active');
});

document.getElementById("button_save").addEventListener('click', function (e) {
    sendAddTaskRequest("/tasks/add_task")
});

function makeTask( data){
    let newTask = document.createElement("tr");
    newTask.id = data.id;
    let name = document.createElement("td")
    name.className = "teacher_task";
    name.innerHTML = data.name;
    let contest = document.createElement("td");
    contest.innerHTML= `${data.contest_type} ${data.contest_number} задача ${data.task_number}`;
    let score = document.createElement("td");
    score.innerHTML=data.taken_max;
    let student = document.createElement("td");
    student.innerHTML = "Утка";
    let input = document.createElement("td");
    input.innerHTML = `<input className=grade type=number name=t min=0 max=30 step=0.1></td>`;
    newTask.append(name, contest, score,student,input);
    tasks.append(newTask);
}

function sendAddTaskRequest(url) {
    return fetch('/tasks/add_task', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            name: form.name.value,
            contest_type: form.answer.value=="long"?"Длинный":"Короткий",
            contest_number: form.contestNumber.value,
            task_number: form.word.value,
            description: form.description.value,
            taken_max: form.limit.value,
            dead_line: form.days.value,
            task_value: form.score.value
        })
    }).then(response => {
            if (response.ok && response.status[0] !== "3") {
                modal.classList.remove('modal_active');
                form.reset();
            }
            else{
                alert("Не удалось создать задачу, попробуйте еще раз")
            }
        });
}
function sendGetTaskRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}