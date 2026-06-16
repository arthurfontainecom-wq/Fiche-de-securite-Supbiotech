const repoOwner = "sup-biotech";
const repoName = "Fiche-de-securite-Supbiotech";

// 1. TES RECHERCHES ASSOCIÉES (SYNONYMES)
const synonymes = {
    "caca": "etron poop merde", 
    "acide_chlorhydrique": "hcl danger corrosif acide fort",
    "ethanol": "alcool inflammable nettoyage",
    "acetone": "solvant vernis inflammable"
};

// 2. CHARGER ET AFFICHER LES PDF
async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    try {
        
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?t=${new Date().getTime()}`);
        const files = await response.json();
        
        if (!Array.isArray(files)) {
            listElement.innerHTML = "<li>Aucun fichier trouvé ou dossier inexistant.</li>";
            return;
        }
        
        listElement.innerHTML = "";

        files.forEach(file => {
            if (file.name.toLowerCase().endsWith('.pdf')) {
                const li = document.createElement('li');
                const idFichier = file.name.replace('.pdf', '').toLowerCase();
                const nomAffiche = idFichier.replace(/_/g, ' ').replace(/-/g, ' ');
                
                
                const tags = synonymes[idFichier] || "";
                li.setAttribute('data-keywords', tags);
                
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            }
        });

        
        appliquerFiltrage();

    } catch (e) {
        listElement.innerHTML = "<li>Erreur de chargement des fiches.</li>";
    }
}

// 3. FONCTION D'UPLOAD (REMPLACE NETLIFY)
async function uploadPDF() {
    const title = document.getElementById('fileTitle').value.trim();
    const file = document.getElementById('fileInput').files[0];
    const token = document.getElementById('ghToken').value.trim(); 
    const status = document.getElementById('uploadStatus');

    if (!title || !file || !token) {
        status.innerText = "⚠️ Remplissez tous les champs (Nom, Fichier, Token).";
        status.style.color = "orange";
        return;
    }

    const fileName = title.replace(/\s+/g, '_').toLowerCase() + ".pdf";
    const reader = new FileReader();

    reader.onload = async () => {
        const content = reader.result.split(',')[1]; 
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches/${fileName}`;

        status.innerText = "⏳ Envoi en cours vers GitHub...";
        status.style.color = "white";

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { 
                    "Authorization": `token ${token}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    message: `Ajout de la fiche ${title}`,
                    content: content
                })
            });

            if (response.ok) {
                status.innerText = "✅ Succès ! Le PDF est enregistré. Actualisation de la liste...";
                status.style.color = "#1db954"; 
                
                
                document.getElementById('fileTitle').value = "";
                document.getElementById('fileInput').value = "";

               
                setTimeout(chargerFiches, 2000);
            } else {
                const errorData = await response.json();
                status.innerText = `❌ Erreur GitHub (${response.status}) : ${errorData.message}`;
                status.style.color = "red";
            }
        } catch (error) {
            status.innerText = "❌ Erreur réseau impossible de joindre GitHub.";
            status.style.color = "red";
        }
    };
    reader.readAsDataURL(file);
}

// 4. BARRE DE RECHERCHE 
function appliquerFiltrage() {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return;
    
    const filter = searchBar.value.toLowerCase();
    document.querySelectorAll('#pdfList li').forEach(item => {
        const text = item.textContent.toLowerCase();
        const tags = item.getAttribute('data-keywords') || "";
        item.style.display = (text.includes(filter) || tags.includes(filter)) ? "" : "none";
    });
}

document.getElementById('searchBar').addEventListener('input', appliquerFiltrage);
document.addEventListener('DOMContentLoaded', chargerFiches);
