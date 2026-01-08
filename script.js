const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const listElement = document.getElementById(idListe);
    // On force la lecture sur la branche main
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}?ref=main`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Dossier introuvable");
        
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
        listElement.innerHTML = "<li>Dossier /pdf/" + nomVille + " vide ou inexistant</li>";
    }
}

// Fonction de recherche simple
function activerRecherche(idInput, idListe) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('input', function() {
            const filter = this.value.toLowerCase();
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
    activerRecherche('searchVillejuif', 'pdfVillejuif');
    activerRecherche('searchLyon', 'pdfLyon');
});