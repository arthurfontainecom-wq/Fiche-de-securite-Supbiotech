const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const listElement = document.getElementById(idListe);
    // On tape directement dans la branche main pour avoir les derniers PDF ajoutés
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}?ref=main`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        
        // On vide la liste avant d'ajouter les PDF
        listElement.innerHTML = ""; 

        files.forEach(file => {
            // Si c'est un PDF, on l'ajoute direct à la liste
            if (file.name.toLowerCase().endsWith('.pdf')) {
                const li = document.createElement('li');
                const nomPropre = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
                
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomPropre}</a>`;
                listElement.appendChild(li);
            }
        });
    } catch (error) {
        console.log("Erreur technique pour " + nomVille);
    }
}

function configurerRecherche(idInput, idListe) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const items = document.getElementById(idListe).getElementsByTagName('li');
            for (let item of items) {
                item.style.display = item.textContent.toLowerCase().includes(filter) ? "" : "none";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // On lance le chargement pour Villejuif et Lyon
    chargerDossier('villejuif', 'pdfVillejuif');
    chargerDossier('lyon', 'pdfLyon');
    
    // On active la barre de recherche
    configurerRecherche('searchVillejuif', 'pdfVillejuif');
    configurerRecherche('searchLyon', 'pdfLyon');
});
