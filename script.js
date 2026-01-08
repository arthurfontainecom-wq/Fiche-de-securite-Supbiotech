const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

// 1. Fonction pour charger les fichiers d'un dossier spécifique
async function chargerDossier(nomVille, idListe) {
    const url = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@main/pdf/${nomVille}/`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) return;
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const listElement = document.getElementById(idListe);
        if (listElement) {
            listElement.innerHTML = ""; 

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.toLowerCase().endsWith('.pdf')) {
                    const fileName = decodeURIComponent(href.split('/').pop());
                    const li = document.createElement('li');
                    const nomAffiche = fileName.replace('.pdf', '').replace(/_/g, ' ');
                    
                    const downloadUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/pdf/${nomVille}/${fileName}`;
                    
                    li.innerHTML = `<a href="${downloadUrl}" target="_blank">${nomAffiche}</a>`;
                    listElement.appendChild(li);
                }
            });
        }
    } catch (error) {
        console.error("Erreur pour " + nomVille + " :", error);
    }
}

// 2. Fonction de filtrage réutilisable
function configurerRecherche(idInput, idListe) {
    const input = document.getElementById(idInput);
    const list = document.getElementById(idListe);
    
    if (input && list) {
        input.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const items = list.getElementsByTagName('li');

            for (let i = 0; i < items.length; i++) {
                const text = items[i].textContent.toLowerCase().trim();
                items[i].style.display = text.includes(filter) ? "" : "none";
            }
        });
    }
}

// 3. Initialisation unique au chargement
document.addEventListener('DOMContentLoaded', async () => {
    // On charge les deux dossiers en parallèle
    await Promise.all([
        chargerDossier('villejuif', 'pdfVillejuif'),
        chargerDossier('lyon', 'pdfLyon')
    ]);

    // On active la recherche pour chaque ville
    configurerRecherche('searchVillejuif', 'pdfVillejuif');
    configurerRecherche('searchLyon', 'pdfLyon'); // Assure-toi d'avoir cet ID dans ton HTML pour Lyon
});



