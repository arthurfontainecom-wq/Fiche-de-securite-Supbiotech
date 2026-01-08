const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerDossier(nomVille, idListe) {
    const listElement = document.getElementById(idListe);
    // On utilise un paramètre de temps (?t=...) pour forcer GitHub à nous donner les nouveaux fichiers
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pdf/${nomVille}?t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // SI CA LIMITE LE NOMBRE DE REQUETES
            if (response.status === 403) {
                listElement.innerHTML = "<li>Erreur : Limite GitHub atteinte (attends 5 min)</li>";
                return;
            }
            listElement.innerHTML = `<li>Dossier '/pdf/${nomVille}' introuvable sur GitHub</li>`;
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
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            });
        }
    } catch (error) {
        listElement.innerHTML = "<li>Erreur de script : " + error.message + "</li>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerDossier('villejuif', 'pdfVillejuif');
    chargerDossier('lyon', 'pdfLyon');
});
