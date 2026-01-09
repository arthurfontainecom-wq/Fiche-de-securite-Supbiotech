const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        listElement.innerHTML = ""; 

        files.forEach(file => {
            if (file.name.toLowerCase().endsWith('.pdf')) {
                const li = document.createElement('li');
                const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
                const pdfUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/fiches/${file.name}`;
                li.innerHTML = `<a href="${pdfUrl}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            }
        });
    } catch (e) {
        console.log("En attente de documents dans le dossier 'fiches'...");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerFiches();
    
    // Recherche
    document.getElementById('searchBar').addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const items = document.getElementById('pdfList').getElementsByTagName('li');
        for (let item of items) {
            item.style.display = item.textContent.toLowerCase().includes(filter) ? "" : "none";
        }
    });
});

