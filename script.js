const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(path, elementId) {
    const url = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@main/${path}/`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        const listElement = document.getElementById(elementId);

        if (listElement) {
            listElement.innerHTML = ""; // Vide la liste
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.toLowerCase().endsWith('.pdf')) {
                    const fileName = decodeURIComponent(href.split('/').pop());
                    const li = document.createElement('li');
                    const nomAffiche = fileName.replace('.pdf', '').replace(/_/g, ' ');
                    const downloadUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${path}/${fileName}`;
                    
                    li.innerHTML = `<a href="${downloadUrl}" target="_blank">${nomAffiche}</a>`;
                    listElement.appendChild(li);
                }
            });
        }
    } catch (e) { console.error("Erreur sur " + path, e); }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Charge les deux dossiers en parallèle
    await Promise.all([
        chargerDossier("pdf/villejuif", "pdfVillejuif"),
        chargerDossier("pdf/lyon", "pdfLyon")
    ]);

    // Ton code de recherche reste le même ici...
});
// 2. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // On attend que les fichiers soient chargés avant d'activer la recherche
    await chargerPDFsAutomatique();

    const input = document.getElementById('searchVillejuif');
    const list = document.getElementById('pdfVillejuif');
    const items = list.getElementsByTagName('li');

    // Ton code de recherche reste identique et fonctionnera sur les nouveaux éléments
    input.addEventListener('input', function() {
        const filter = this.value.toLowerCase().trim();

        for (let i = 0; i < items.length; i++) {
            const text = items[i].textContent.toLowerCase().trim();
            if (text.startsWith(filter)) {
                items[i].style.display = "";
            } else {
                items[i].style.display = "none";
            }
        }
    });
});


