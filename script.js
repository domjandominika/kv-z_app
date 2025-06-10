function getTemaFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tema");
}

const temaKategoriak = {
    tortenelem: 23,
    foldrajz: 22,
    tudomany: 17
};

let pontszam = 0;
let maxKerdes = 0;

async function toltsdBeAKerdeseket() {
    const tema = getTemaFromURL();
    const kategoriaId = temaKategoriak[tema];

    if (!kategoriaId) {
        document.getElementById("kerdesek").innerText = "Ismeretlen téma.";
        return;
    }

    const url = `https://opentdb.com/api.php?amount=5&category=${kategoriaId}&difficulty=easy&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        maxKerdes = data.results.length;
        megjelenitKerdeseket(data.results);
    } catch (error) {
        console.error("Hiba történt a kérdések lekérésekor:", error);
        document.getElementById("kerdesek").innerText = "Hiba történt az adatok betöltésekor.";
    }
}

function megjelenitKerdeseket(kerdesek) {
    const kontener = document.getElementById("kerdesek");
    kontener.innerHTML = "";

    let aktualisIndex = 0;

    function kovetkezoKerdes() {
        if (aktualisIndex >= kerdesek.length) {
            window.location.href = `eredmeny.html?pontszam=${pontszam}&max=${maxKerdes}`;
            return;
        }

        const kerdesObj = kerdesek[aktualisIndex];
        const valaszok = [...kerdesObj.incorrect_answers, kerdesObj.correct_answer].sort(() => Math.random() - 0.5);

        kontener.innerHTML = `
            <h3>${aktualisIndex + 1}. ${decodeHTML(kerdesObj.question)}</h3>
            <ul>
                ${valaszok.map(valasz => `<li><button class="valasz-gomb">${decodeHTML(valasz)}</button></li>`).join('')}
            </ul>
        `;

        const gombok = document.querySelectorAll(".valasz-gomb");
        gombok.forEach(gomb => {
            gomb.addEventListener("click", () => {
                const valasz = gomb.innerText;
                if (valasz === decodeHTML(kerdesObj.correct_answer)) {
                    pontszam++;
                }
                aktualisIndex++;
                kovetkezoKerdes();
            });
        });
    }

    kovetkezoKerdes();
}

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

if (window.location.pathname.includes("kviz.html")) {
    toltsdBeAKerdeseket();
}
