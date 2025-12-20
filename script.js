let toutesLesCartes = [];

/* ===== CHARGEMENT DES CARTES ===== */
fetch("cartes.json")
  .then(response => response.json())
  .then(cartes => {
    toutesLesCartes = cartes;
    afficherCartes(cartes);
  })
  .catch(error => console.error("Erreur chargement JSON :", error));

/* ===== ELEMENTS FILTRES ===== */
const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".checkboxes input");

/* ===== ELEMENTS MODAL ===== */
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalNom = document.getElementById("modalNom");
const modalImage = document.getElementById("modalImage");
const modalCouleurs = document.getElementById("modalCouleurs");

/* ===== EVENTS FILTRES ===== */
if (searchInput) {
  searchInput.addEventListener("input", filtrer);
  checkboxes.forEach(cb => cb.addEventListener("change", filtrer));
}

/* ===== FILTRAGE ===== */
function filtrer() {
  const texte = searchInput.value.toLowerCase();

  const couleursSelectionnees = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const cartesFiltrees = toutesLesCartes.filter(carte => {
    const matchNom = carte.nom.toLowerCase().includes(texte);

    const matchCouleur =
      couleursSelectionnees.length === 0 ||
      couleursSelectionnees.some(c => carte.couleurs.includes(c));

    return matchNom && matchCouleur;
  });

  afficherCartes(cartesFiltrees);
}

/* ===== AFFICHAGE DES CARTES ===== */
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

    // Clic pour ouvrir la carte en grand
    div.addEventListener("click", () => ouvrirModal(carte));

    container.appendChild(div);
  });
}

/* ===== MODAL ===== */
function ouvrirModal(carte) {
  modalNom.textContent = carte.nom;
  modalImage.src = carte.image;

  modalCouleurs.innerHTML = carte.couleurs
    .map(c => `<span class="couleur ${c}">${c}</span>`)
    .join("");

  modal.classList.remove("hidden");
}

// Fermer avec la croix
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Fermer en cliquant sur le fond
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
