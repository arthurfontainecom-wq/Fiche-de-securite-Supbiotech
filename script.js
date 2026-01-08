const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";
const folderPath = "pdf"; 

async function chargerPDFsAutomatique() {
    // On passe par jsDelivr pour lister les fichiers sans blocage API
    const url = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@main/${folderPath}/`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur réseau");
        
        const html = await response.text();
        
        // On crée un faux document pour lire les liens dans la page
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const listVillejuif = document.getElementById('pdfVillejuif');
        if (listVillejuif) {
            listVillejuif.innerHTML = ""; // On vide la liste actuelle

            links.forEach(link => {
                const href = link.getAttribute('href');
                // On vérifie si c'est un PDF (on ignore les dossiers et fichiers système)
                if (href && href.toLowerCase().endsWith('.pdf')) {
                    // On récupère le nom du fichier proprement
                    const fileName = decodeURIComponent(href.split('/').pop());
                    
                    const li = document.createElement('li');
                    const nomAffiche = fileName.replace('.pdf', '').replace(/_/g, ' ');
                    
                    // Lien direct vers le fichier brut sur GitHub
                    const downloadUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${fileName}`;
                    
                    li.innerHTML = `<a href="${downloadUrl}" target="_blank">${nomAffiche}</a>`;
                    listVillejuif.appendChild(li);
                }
            });
        }
    } catch (error) {
        console.error("Erreur de chargement (CDN) :", error);
    }
}

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

