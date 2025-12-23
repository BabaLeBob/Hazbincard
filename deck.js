let toutesLesCartes = [];
let cartesParId = {};
let deck = {};

/* ===== CHARGEMENT ===== */
fetch("cartes.json")
  .then(res => res.json())
  .then(cartes => {
    toutesLesCartes = cartes;
    cartes.forEach(c => cartesParId[c.id] = c);
    afficherCartes(cartes);
  });

/* ===== ELEMENTS ===== */
const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".checkboxes input");
const exportBtn = document.getElementById("exportDeck");
const importInput = document.getElementById("importDeck");

/* ===== FILTRES ===== */
searchInput.addEventListener("input", filtrer);
checkboxes.forEach(cb => cb.addEventListener("change", filtrer));

function filtrer() {
  const texte = searchInput.value.toLowerCase();
  const couleurs = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const resultat = toutesLesCartes.filter(carte => {
    const matchNom = carte.nom.toLowerCase().includes(texte);
    const matchCouleur =
      couleurs.length === 0 ||
      couleurs.some(c => carte.couleurs.includes(c));

    return matchNom && matchCouleur;
  });

  afficherCartes(resultat);
}

/* ===== CARTES DISPONIBLES ===== */
function afficherCartes(cartes) {
  const container = document.getElementById("cartes-dispo");
  container.innerHTML = "";

  cartes.forEach(carte => {
    const div = document.createElement("div");
    div.className = "carte";

    div.innerHTML = `
      <img src="${carte.image}" alt="${carte.nom}">
      <div class="nom">${carte.nom}</div>
    `;

    div.addEventListener("click", () => ajouterCarte(carte.id));
    container.appendChild(div);
  });
}

/* ===== DECK ===== */
function ajouterCarte(id) {
  if (totalCartesDeck() >= 51) {
    alert("51 cartes maximum");
    return;
  }

  if (!deck[id]) deck[id] = 0;
  if (deck[id] >= 4) {
    alert("4 exemplaires max");
    return;
  }

  deck[id]++;
  afficherDeck();
}

function retirerCarte(id) {
  deck[id]--;
  if (deck[id] <= 0) delete deck[id];
  afficherDeck();
}

function afficherDeck() {
  const container = document.getElementById("deck-cartes");
  container.innerHTML = "";

  Object.entries(deck).forEach(([id, qty]) => {
    const carte = cartesParId[id];

    const div = document.createElement("div");
    div.className = "carte";

    div.innerHTML = `
      <img src="${carte.image}" alt="${carte.nom}">
      <div class="nom">${carte.nom}</div>
      <div class="count">x${qty}</div>
    `;

    div.addEventListener("click", () => retirerCarte(id));
    container.appendChild(div);
  });

  document.getElementById("deck-count").textContent = totalCartesDeck();
}

/* ===== EXPORT ===== */
exportBtn.addEventListener("click", () => {
  let txt = "";
  Object.entries(deck).forEach(([id, qty]) => {
    txt += `${qty} ${id}\n`;
  });

  const blob = new Blob([txt], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "deck.txt";
  a.click();
});

/* ===== IMPORT ===== */
importInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    deck = {};

    reader.result.split("\n").forEach(line => {
      const [qtyStr, id] = line.trim().split(" ");
      const qty = parseInt(qtyStr);
      if (!cartesParId[id]) return;
      deck[id] = Math.min(qty, 4);
    });

    afficherDeck();
  };
  reader.readAsText(file);
});

/* ===== UTIL ===== */
function totalCartesDeck() {
  return Object.values(deck).reduce((a, b) => a + b, 0);
}
