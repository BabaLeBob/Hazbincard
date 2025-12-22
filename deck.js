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

/* ===== CARTES DISPO ===== */
function afficherCartesDisponibles() {
  const container = document.getElementById("cartes-dispo");
  container.innerHTML = "";

  toutesLesCartes.forEach(carte => {
    const div = document.createElement("div");
    div.className = "carte-mini";
    div.innerHTML = `
      <span>${carte.nom} <small>(${carte.id})</small></span>
      <span class="carte-count">+</span>
    `;
    div.addEventListener("click", () => ajouterCarte(carte.id));
    container.appendChild(div);
  });
}

/* ===== AJOUT / RETRAIT ===== */
function ajouterCarte(id) {
  if (totalCartesDeck() >= 51) return alert("51 cartes max");
  if (!deck[id]) deck[id] = 0;
  if (deck[id] >= 4) return alert("4 exemplaires max");

  deck[id]++;
  afficherDeck();
}

function retirerCarte(id) {
  if (!deck[id]) return;
  deck[id]--;
  if (deck[id] === 0) delete deck[id];
  afficherDeck();
}

/* ===== AFFICHAGE DECK ===== */
function afficherDeck() {
  const container = document.getElementById("deck-cartes");
  container.innerHTML = "";

  Object.entries(deck).forEach(([id, qty]) => {
    const carte = cartesParId[id];
    const div = document.createElement("div");
    div.className = "carte-mini";
    div.innerHTML = `
      <span>${carte.nom} <small>(${id})</small></span>
      <span class="carte-count">x${qty}</span>
    `;
    div.addEventListener("click", () => retirerCarte(id));
    container.appendChild(div);
  });

  document.getElementById("deck-count").textContent = totalCartesDeck();
}

/* ===== EXPORT TXT ===== */
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
      const [qty, id] = line.trim().split(" ");
      if (!cartesParId[id]) return;
      deck[id] = Math.min(parseInt(qty), 4);
    });
    afficherDeck();
  };
  reader.readAsText(file);
});

/* ===== UTIL ===== */
function totalCartesDeck() {
  return Object.values(deck).reduce((a, b) => a + b, 0);
}
