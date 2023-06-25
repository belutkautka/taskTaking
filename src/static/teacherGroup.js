const students = document.getElementById("students")
const sortSign = document.getElementsByClassName('sort_sign')[0];
let sortedStudents = null;
let sortedDescStudents = null;
let unsortedStudents = null;
sendGetStudentsRequest("/tasks/get_students_by_teacher_id").then(data => data.Data.forEach(e => createNewStudent(e)))

function sendGetStudentsRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

sortSign.addEventListener('click', function (e) {
    if (unsortedStudents === null)
        unsortedStudents = Array.from(students.querySelectorAll('tr')).slice(1)
    if (sortSign.innerHTML === '↕') {
        sortSign.innerHTML = '↑';
        if (sortedStudents === null) {
            sortedStudents = Array.from(students.querySelectorAll('tr'))
                .slice(1)
                .sort((rowA, rowB) => +rowA.cells[1].innerHTML > +rowB.cells[1].innerHTML ? 1 : -1);
            sortedDescStudents = Array.from(sortedStudents);
            sortedDescStudents.reverse();
        }
        students.tBodies[0].append(...sortedStudents);
    } else if (sortSign.innerHTML === '↑') {
        sortSign.innerHTML = '↓';
        students.tBodies[0].append(...sortedDescStudents);
    } else {
        sortSign.innerHTML = '↕';
        students.tBodies[0].append(...unsortedStudents);
    }
});

function createNewStudent(student) {
    let newStudent = document.createElement("tr");
    let name = document.createElement("td");
    name.innerHTML = student.username;
    let score = document.createElement("td");
    score.innerHTML = student.score_sum;
    newStudent.append(name, score);
    students.append(newStudent);
}