const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const listElement = document.getElementById(idListe);
    // Le ?t= force GitHub à ne pas utiliser une ancienne version en cache
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}?t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                listElement.innerHTML = "<li>Limite GitHub atteinte (attendre 5 min)</li>";
                return;
            }
            listElement.innerHTML = "<li>Dossier non trouvé</li>";
            return;
        }
        
        const files = await response.json();
        listElement.innerHTML = ""; 

        const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));

        if (pdfs.length === 0) {
            listElement.innerHTML = "<li>Aucun document trouvé</li>";
        } else {
            pdfs.forEach(file => {
                const li = document.createElement('li');
                const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ');
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            });
        }
    } catch (error) {
        listElement.innerHTML = "<li>Erreur de chargement</li>";
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
    chargerDossier('villejuif', 'pdfVillejuif');
    chargerDossier('lyon', 'pdfLyon');
    configurerRecherche('searchVillejuif', 'pdfVillejuif');
    configurerRecherche('searchLyon', 'pdfLyon');
});
