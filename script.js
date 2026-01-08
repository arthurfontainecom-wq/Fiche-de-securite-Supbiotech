const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    // On force la mise à jour de la liste avec un timestamp (?t=...)
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main&t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        
        if (listElement) {
            listElement.innerHTML = ""; 

            files.forEach(file => {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    const li = document.createElement('li');
                    
                    // On rend le nom joli
                    const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
                    
                    // 1. On récupère l'URL brute du fichier sur GitHub
                    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/fiches/${encodeURIComponent(file.name)}`;
                    
                    // 2. On passe par le lecteur de Google (Google Docs Viewer)
                    // Cela force l'affichage dans un lecteur PDF propre
                    const googleViewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
                    
                    li.innerHTML = `<a href="${googleViewUrl}" target="_blank" rel="noopener noreferrer">${nomAffiche}</a>`;
                    listElement.appendChild(li);
                }
            });
        }
    } catch (e) {
        console.log("Erreur de chargement ou dossier vide.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerFiches();
    
    // Système de recherche
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const items = document.getElementById('pdfList').getElementsByTagName('li');
            for (let item of items) {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? "" : "none";
            }
        });
    }
});
