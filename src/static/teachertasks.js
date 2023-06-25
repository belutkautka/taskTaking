const modal = document.getElementById('modal_form');
const name = document.getElementById('modal_form');
const form = document.forms.add;
document.getElementById('modal_form__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});
document.getElementById('add_task_button').addEventListener('click', function (e) {
    modal.classList.add('modal_active');
});

document.getElementById("button_save").addEventListener('click', function (e) {
    sendAddTaskRequest("/tasks/add_task")
});

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