const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    // On ajoute un timestamp pour voir les nouveaux PDF instantanément
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main&t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        
        if (listElement) {
            listElement.innerHTML = ""; 

            files.forEach(file => {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    const li = document.createElement('li');
                    
                    // Nettoyage du nom (Acide_Clhoridrique.pdf -> Acide Clhoridrique)
                    const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
                    
                    // ON UTILISE CETTE URL : C'est l'accès direct au contenu brut du fichier
                    // Le navigateur l'ouvrira directement s'il possède un lecteur PDF (99% des cas)
                    const viewUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/fiches/${encodeURIComponent(file.name)}`;
                    
                    // target="_blank" ouvre dans un nouvel onglet
                    li.innerHTML = `<a href="${viewUrl}" target="_blank" rel="noopener noreferrer">${nomAffiche}</a>`;
                    listElement.appendChild(li);
                }
            });
        }
    } catch (e) {
        console.log("Erreur ou dossier vide.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerFiches();
    
    // Barre de recherche
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

