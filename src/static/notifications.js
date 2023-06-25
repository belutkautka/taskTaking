const circle = document.getElementById("circle");
sendRequest("/users/me").then(data=>{
    if (data.has_unchecked_tasks===true){
        circle.classList.remove("block");
    }
})

function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}