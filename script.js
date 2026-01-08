const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const listElement = document.getElementById(idListe);
    
    // On force la lecture sur la branche 'main' pour ignorer les erreurs de déploiement
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}?ref=main`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error("Erreur API:", response.status);
            listElement.innerHTML = "<li>Dossier /pdf/" + nomVille + " introuvable</li>";
            return;
        }
        
        const files = await response.json();
        listElement.innerHTML = ""; 

        const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));

        if (pdfs.length === 0) {
            listElement.innerHTML = "<li>Le dossier est vide sur GitHub</li>";
        } else {
            pdfs.forEach(file => {
                const li = document.createElement('li');
                const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ');
                // On utilise download_url qui est toujours disponible même si le site ne déploie pas
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            });
        }
    } catch (error) {
        listElement.innerHTML = "<li>Erreur de connexion aux fichiers</li>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerDossier('villejuif', 'pdfVillejuif');
    chargerDossier('lyon', 'pdfLyon');
});

