const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";
const folderPath = "pdf"; 

// 1. Fonction pour charger les PDF depuis GitHub
async function chargerPDFsAutomatique() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        const list = document.getElementById('pdfVillejuif'); // Ton ID actuel
        
        if (list) {
            list.innerHTML = ""; // On vide la liste statique

            files.forEach(file => {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    const li = document.createElement('li');
                    const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ');
                    li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                    list.appendChild(li);
                }
            });
        }
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

// 2. Gestion de la recherche et du chargement au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    // On charge d'abord les fichiers
    await chargerPDFsAutomatique();

    const input = document.getElementById('searchVillejuif');
    const list = document.getElementById('pdfVillejuif');
    const items = list.getElementsByTagName('li'); // Récupère les nouveaux <li> créés

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
