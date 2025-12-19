let toutesLesCartes = [];

fetch("cartes.json")
  .then(response => response.json())
  .then(cartes => {
    toutesLesCartes = cartes;
    afficherCartes(cartes);
  });

const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".checkboxes input");

searchInput.addEventListener("input", filtrer);
checkboxes.forEach(cb => cb.addEventListener("change", filtrer));

function filtrer() {
  const texte = searchInput.value.toLowerCase();
  const couleursSelectionnees = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const cartesFiltrees = toutesLesCartes.filter(carte => {
    const matchNom = carte.nom.toLowerCase().includes(texte);

    const matchCouleur =
      couleursSelectionnees.length === 0 ||
      couleursSelectionnees.some(c =>
        carte.couleurs.includes(c)
      );

    return matchNom && matchCouleur;
  });

  afficherCartes(cartesFiltrees);
}

function afficherCartes(cartes) {
  const container = document.getElementById("cartes-container");
  container.innerHTML = "";

  cartes.forEach(carte => {
    const div = document.createElement("div");
    div.className = "carte";

    const couleursHTML = carte.couleurs
      .map(c => `<span class="couleur ${c}">${c}</span>`)
      .join("");

    div.innerHTML = `
      <h2>${carte.nom}</h2>
      <div class="couleurs">${couleursHTML}</div>
      <img src="${carte.image}" alt="${carte.nom}">
    `;

    container.appendChild(div);
  });
}
