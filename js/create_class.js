document.addEventListener("DOMContentLoaded", () => {
    const turmasContainer = document.getElementById("turmasContainer");
    const turmaForm = document.getElementById("turmaForm");

    // Turmas padrão
    const defaultTurmas = [
        {
            name: "São Bento",
            image: "/assets/images/sao-bento.jpg",
            description:
                "São Bento é conhecido como o pai do monaquismo ocidental. Ele escreveu a Regra de São Bento, um guia para vida comunitária em oração e trabalho.",
        },
        {
            name: "Santa Clara",
            image: "/assets/images/santa-clara.jpg",
            description:
                "Santa Clara é lembrada por sua devoção ao Cristo pobre e por fundar a Ordem das Clarissas, inspirada por São Francisco de Assis.",
        },
        {
            name: "São Francisco",
            image: "/assets/images/sao-francisco.jpg",
            description:
                "São Francisco é conhecido por seu amor à natureza, simplicidade e por sua dedicação aos mais pobres e necessitados.",
        },
    ];

    // Carregar turmas do localStorage
    const loadTurmas = () => {
        const storedTurmas = JSON.parse(localStorage.getItem("classes")) || [];
        return [...defaultTurmas, ...storedTurmas];
    };

    // Salvar turmas no localStorage
    const saveTurmas = (turmas) => {
        localStorage.setItem("classes", JSON.stringify(turmas));
    };

    // Renderizar turmas na página
    const renderTurmas = () => {
        const allTurmas = loadTurmas();
        turmasContainer.innerHTML = "";

        allTurmas.forEach((turma, index) => {
            const turmaCard = document.createElement("div");
            turmaCard.className = "turma-card";
            turmaCard.innerHTML = `
                <img src="${turma.image}" alt="${turma.name}">
                <h3>${turma.name}</h3>
                <p>${turma.description}</p>
                <button data-index="${index}">Excluir</button>
            `;
            turmasContainer.appendChild(turmaCard);
        });
    };

    // Excluir turma
    turmasContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const index = event.target.getAttribute("data-index");
            const allTurmas = loadTurmas();

            if (index >= defaultTurmas.length) {
                allTurmas.splice(index, 1);
                saveTurmas(allTurmas.slice(defaultTurmas.length));
                renderTurmas();
            } else {
                alert("Não é permitido excluir turmas padrão.");
            }
        }
    });

    // Adicionar nova turma
    turmaForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("nome").value;
        const description = document.getElementById("descricao").value;
        const imageInput = document.getElementById("imagem");
        const file = imageInput.files[0];

        if (!file) {
            alert("Por favor, faça o upload de uma imagem.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const newTurma = {
                name,
                description,
                image: e.target.result, // Base64 da imagem
            };

            const storedTurmas = JSON.parse(localStorage.getItem("classes")) || [];
            storedTurmas.push(newTurma);

            saveTurmas(storedTurmas);
            renderTurmas();
            turmaForm.reset();
        };

        reader.readAsDataURL(file);
    });

    // Inicializar a página
    renderTurmas();
});
