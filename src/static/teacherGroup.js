const students = document.getElementById("students")
sendGetStudentsRequest("/tasks/get_students_by_teacher_id").then(data => data.Data.forEach(e => createNewStudent(e)))

function sendGetStudentsRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

function createNewStudent(student) {
    let newStudent = document.createElement("tr");
    let name = document.createElement("td");
    name.innerHTML = student.username;
    let score = document.createElement("td");
    score.innerHTML = student.score_sum;
    newStudent.append(name, score);
    students.append(newStudent);
}