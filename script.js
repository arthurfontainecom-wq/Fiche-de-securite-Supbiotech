const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    // On cherche dans le dossier "fiches" à la racine du GitHub
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main&t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            listElement.innerHTML = "<li>Erreur : Créez un dossier nommé 'fiches' sur GitHub</li>";
            return;
        }

        const files = await response.json();
        listElement.innerHTML = ""; 

        files.forEach(file => {
            if (file.name.toLowerCase().endsWith('.pdf')) {
                const li = document.createElement('li');
                const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
                
                // URL Raw pour Google Viewer
                const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/fiches/${encodeURIComponent(file.name)}`;
                const viewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
                
                li.innerHTML = `<a href="${viewUrl}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            }
        });
    } catch (e) {
        listElement.innerHTML = "<li>Erreur de chargement.</li>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerFiches();
    
    document.getElementById('searchBar').addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const items = document.getElementById('pdfList').getElementsByTagName('li');
        for (let item of items) {
            item.style.display = item.textContent.toLowerCase().includes(filter) ? "" : "none";
        }
    });
});