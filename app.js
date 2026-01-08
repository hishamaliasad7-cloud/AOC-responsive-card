const API_URL = "https://krds-assignment.github.io/aoc/api-assets/data.json";
const grid = document.getElementById("grid");
const dotsContainer = document.getElementById("dots");

let cards = [];

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        cards = data.features;
        renderCards(cards);
        renderDots(cards.length);
        attachScrollListener();
    });

function renderCards(items) {
    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "card";

        card.style.background = colors[index % colors.length];

        card.innerHTML = `
      <div class="content">
        <img src="${item.logo}" class="brand" />
        <h2>${item.title}</h2>
        <p>${item.desc}</p>
      </div>
      <img src="${item.image}" class="product" />
    `;

        grid.appendChild(card);
    });
}


function renderDots(count) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");
        dot.className = i === 0 ? "dot active" : "dot";
        dotsContainer.appendChild(dot);
    }
}

function attachScrollListener() {
    grid.addEventListener("scroll", () => {
        const index = Math.round(grid.scrollLeft / grid.offsetWidth);
        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    });
}
const colors = [
    "#cf520fff",
    "#785af2ff",
    "#f0b86fff",
    "#f25a6eff",
    "#c7ef27ff",
    "#4BB7A7",
    "#5B7DBE",
    "#8FB339",
    "#9B6B9E",
];