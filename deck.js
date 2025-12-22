let toutesLesCartes = [];
let cartesParId = {};
let deck = {}; // { id: quantité }

/* ===== CHARGEMENT ===== */
fetch("cartes.json")
  .then(res => res.json())
  .then(cartes => {
    toutesLesCartes = cartes;
    cartes.forEach(c => cartesParId[c.id] = c);
    afficherCartesDisponibles();
  });

const exportBtn = document.getElementById("exportDeck");
const importInput = document.getElementById("importDeck");

/* ===== CARTES DISPONIBLES ===== */
function afficherCartesDisponibles() {
  const container = document.getElementById("cartes-dispo");
  container.innerHTML = "";

  toutesLesCartes.forEach(carte => {
    const div = document.createElement("div");
    div.className = "carte-mini";

    div.innerHTML = `
      <img src="${carte.image}" alt="${carte.nom}">
      <span class="nom">${carte.nom}</span>
      <span class="carte-count">+</span>
    `;

    div.addEventListener("click", () => ajouterCarte(carte.id));
    container.appendChild(div);
  });
}

/* ===== AJOUT / RETRAIT ===== */
function ajouterCarte(id) {
  if (totalCartesDeck() >= 51) {
    alert("Deck limité à 51 cartes maximum");
    return;
  }

  if (!deck[id]) deck[id] = 0;

  if (deck[id] >= 4) {
    alert("Maximum 4 exemplaires par carte");
    return;
  }

  deck[id]++;
  afficherDeck();
}

function retirerCarte(id) {
  if (!deck[id]) return;

  deck[id]--;
  if (deck[id] === 0) delete deck[id];

  afficherDeck();
}

/* ===== AFFICHAGE DU DECK ===== */
function afficherDeck() {
  const container = document.getElementById("deck-cartes");
  container.innerHTML = "";

  Object.entries(deck).forEach(([id, qty]) => {
    const carte = cartesParId[id];
    if (!carte) return;

    const div = document.createElement("div");
    div.className = "carte-mini";

    div.innerHTML = `
      <img src="${carte.image}" alt="${carte.nom}">
      <span class="nom">${carte.nom}</span>
      <span class="carte-count">x${qty}</span>
    `;

    div.addEventListener("click", () => retirerCarte(id));
    container.appendChild(div);
  });

  document.getElementById("deck-count").textContent = totalCartesDeck();
}

/* ===== EXPORT TXT (ID INTERNE) ===== */
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

/* ===== IMPORT TXT ===== */
importInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    deck = {};

    reader.result.split("\n").forEach(line => {
      line = line.trim();
      if (!line) return;

      const [qtyStr, id] = line.split(" ");
      const qty = parseInt(qtyStr);

      if (!cartesParId[id] || isNaN(qty)) return;

      deck[id] = Math.min(qty, 4);
    });

    // Respect limite 51
    Object.keys(deck).forEach(id => {
      while (totalCartesDeck() > 51) {
        deck[id]--;
        if (deck[id] <= 0) delete deck[id];
      }
    });

    afficherDeck();
  };

  reader.readAsText(file);
});

/* ===== UTIL ===== */
function totalCartesDeck() {
  return Object.values(deck).reduce((a, b) => a + b, 0);
}
