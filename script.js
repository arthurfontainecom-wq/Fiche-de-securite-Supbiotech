const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Dossier introuvable");
        
        const files = await response.json();
        const listElement = document.getElementById(idListe);
        
        if (listElement) {
            listElement.innerHTML = ""; 

            files.forEach(file => {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    const li = document.createElement('li');
                    const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ');
                    
                    li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                    listElement.appendChild(li);
                }
            });
        }
    } catch (error) {
        console.error("Erreur pour " + nomVille + " :", error);
        const listElement = document.getElementById(idListe);
        if (listElement) {
            listElement.innerHTML = "<li>Aucun document trouvé</li>";
        }
    }
}

function configurerRecherche(idInput, idListe) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const items = document.getElementById(idListe).getElementsByTagName('li');

            for (let item of items) {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? "" : "none";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Chargement des dossiers
    await Promise.all([
        chargerDossier('villejuif', 'pdfVillejuif'),
        chargerDossier('lyon', 'pdfLyon')
    ]);

    // Activation de la recherche
    configurerRecherche('searchVillejuif', 'pdfVillejuif');
    configurerRecherche('searchLyon', 'pdfLyon');
});
