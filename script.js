const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-de-securite-Supbiotech";

async function chargerFiches() {
  const listElement = document.getElementById('pdfList');
  // Utilisation des backticks (``) pour l'injection de variables
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main`;

  try {
    const response = await fetch(url);
    const files = await response.json();
    listElement.innerHTML = "";

    files.forEach(file => {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const li = document.createElement('li');
        const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
        li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
        listElement.appendChild(li);
      }
    });
  } catch (e) {
    console.log("En attente de documents dans le dossier 'fiches'...");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerFiches();

  // Logique de recherche
  document.getElementById('searchBar').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const items = document.getElementById('pdfList').getElementsByTagName('li');
    
    for (let item of items) {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(filter) ? "" : "none";
    }
  });
});






