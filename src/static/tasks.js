// document.querySelector('.task_table').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.add('modal_active');
// });
// document.querySelector('.modal__close-button').addEventListener('click', function (e) {
//     let modal = document.getElementById('modal');
//     modal.classList.remove('modal_active');
// })

for (let i =0;i<7;i++){
    createNewTask("Эрен уничтожает всех титанов","Длинный контест 5 задача С","2.8")
}
function createNewTask(tValue, pValue, gValue) {
    let newTask = document.createElement("div");
    newTask.className="task_table";
    let title = document.createElement("div")
    title.className="title"
    title.innerHTML = tValue
    let path = document.createElement("div")
    path.className= "path"
    path.innerHTML= pValue
    let grade = document.createElement("div")
    grade.className = "grade"
    grade.innerHTML = gValue
    newTask.append(title,path,grade)
    document.getElementById("titles").append(newTask)
}