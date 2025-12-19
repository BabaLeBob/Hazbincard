fetch("cartes.json")
  .then(response => response.json())
  .then(cartes => {
    const container = document.getElementById("cartes-container");

    cartes.forEach(carte => {
      const div = document.createElement("div");
      div.className = "carte";

      div.innerHTML = `
        <h2>${carte.nom}</h2>
        <p>Type : ${carte.type}</p>
        <p>Attaque : ${carte.attaque}</p>
        <img src="${carte.image}" alt="${carte.nom}">
      `;

      container.appendChild(div);
    });
  });

