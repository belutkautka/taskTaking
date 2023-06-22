sendGetRequest("/users/me").then(data => {
    document.getElementsByClassName('page_title')[0].innerHTML = data.username;
    document.getElementsByClassName('person_score')[0].innerHTML = data.score_sum;
})

function sendGetRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}