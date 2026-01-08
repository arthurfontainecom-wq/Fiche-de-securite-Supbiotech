const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";
const folderPath = "pdf"; 

// 1. Fonction qui va chercher les PDF sur GitHub et les affiche
async function chargerPDFsAutomatique() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;
    
    try {
        const response = await fetch(url);
        const files = await response.json();
        const list = document.getElementById('pdfVillejuif'); // Ton ID actuel
        
        if (list) {
            list.innerHTML = ""; // On vide la liste écrite à la main pour mettre la liste auto

            files.forEach(file => {
                // On vérifie que c'est bien un PDF
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    const li = document.createElement('li');
                    // On nettoie le nom (on enlève .pdf et les tirets du bas)
                    const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ');
                    li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                    list.appendChild(li);
                }
            });
        }
    } catch (error) {
        console.error("Erreur GitHub API :", error);
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
