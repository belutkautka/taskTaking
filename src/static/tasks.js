// document.querySelector('.task_table').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.add('modal_active');
// });
// document.querySelector('.modal__close-button').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.remove('modal_active');
// })

for (let i =0;i<7;i++){
    createNewFieldSet()
}
function createNewFieldSet() {
    let newTask = document.createElement("div");
    newTask.className="task_table";
    let title = document.createElement("div")
    title.className="title"
    title.innerHTML = "Эрен уничтожает всех титанов"
    let path = document.createElement("div")
    path.className= "path"
    path.innerHTML= "Длинный контест 5 задача С"
    let grade = document.createElement("div")
    grade.className = "grade"
    grade.innerHTML = "2.8"
    newTask.append(title,path,grade)
    document.getElementById("titles").append(newTask)
}