document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchVillejuif');
    const list = document.getElementById('pdfVillejuif');
    const items = list.getElementsByTagName('li');

    input.addEventListener('input', function() {
        const filter = this.value.toLowerCase().trim();

        for (let i = 0; i < items.length; i++) {
            const text = items[i].textContent.toLowerCase().trim();
            
            // "startsWith" permet de ne garder que ce qui commence par la lettre tapée
            if (text.startsWith(filter)) {
                items[i].style.display = "";
            } else {
                items[i].style.display = "none";
            }
        }
    });
});