
document.addEventListener('DOMContentLoaded', () => {
    fetch('/port-folio/assets/partials/nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;
        });
});

