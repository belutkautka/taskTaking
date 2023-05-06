document.querySelector('.task_table').addEventListener('click', function (e) {
    let modal = document.getElementById('modal');
    modal.classList.add('modal_active');
});
document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    let modal = document.getElementById('modal');
    modal.classList.remove('modal_active');
})