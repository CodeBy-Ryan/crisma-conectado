document.addEventListener("DOMContentLoaded", () => {
    const turmasContainer = document.getElementById("turmasContainer");
    const btnVoltar = document.getElementById("btnVoltar");

    // Função do botão "Voltar"
    btnVoltar.addEventListener("click", () => {
        window.history.back(); // Volta para a página anterior
    });

    // Turmas existentes no código
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

    // Obtenha as turmas armazenadas no localStorage
    const storedTurmas = JSON.parse(localStorage.getItem("classes")) || [];

    // Combine as turmas padrão com as turmas cadastradas
    const allTurmas = [...defaultTurmas, ...storedTurmas];

    // Renderize as turmas na página
    const renderTurmas = () => {
        turmasContainer.innerHTML = "";
        allTurmas.forEach((turma) => {
            const turmaCard = document.createElement("div");
            turmaCard.className = "turma-card";
            turmaCard.innerHTML = `
                <img src="${turma.image}" alt="${turma.name}">
                <div class="turma-info">
                    <h2>${turma.name}</h2>
                    <p>${turma.description}</p>
                    <a href="/Pages/login.html" class="btn">Acessar Turma</a>
                </div>
            `;
            turmasContainer.appendChild(turmaCard);
        });
    };

    renderTurmas();
});
