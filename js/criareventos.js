document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("eventForm");
    const eventList = document.getElementById("eventList");
    const backButton = document.getElementById("backButton");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const turmaName = loggedInUser?.turma;

    // Função para salvar um novo evento
    const saveEvent = (event) => {
        const eventsData = JSON.parse(localStorage.getItem("eventsData")) || {};
        if (!eventsData[turmaName]) {
            eventsData[turmaName] = [];
        }
        eventsData[turmaName].push(event);
        localStorage.setItem("eventsData", JSON.stringify(eventsData));
    };

    // Função para renderizar os eventos criados
    const renderEvents = () => {
        const eventsData = JSON.parse(localStorage.getItem("eventsData")) || {};
        const turmaEvents = eventsData[turmaName] || [];

        eventList.innerHTML = "";
        turmaEvents.forEach((event, index) => {
            const eventDiv = document.createElement("div");
            eventDiv.className = "event";

            eventDiv.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Data:</strong> ${event.date}</p>
                <p>${event.description}</p>
                <button class="deleteButton" data-index="${index}">Excluir</button>
            `;

            eventList.appendChild(eventDiv);
        });

        // Adicionar eventos aos botões de exclusão
        document.querySelectorAll(".deleteButton").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                turmaEvents.splice(index, 1);
                localStorage.setItem("eventsData", JSON.stringify(eventsData));
                renderEvents();
            });
        });
    };

    // Evento de envio do formulário
    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("eventTitle").value.trim();
        const date = document.getElementById("eventDate").value;
        const description = document.getElementById("eventDescription").value.trim();

        if (!title || !date) {
            alert("Título e data são obrigatórios!");
            return;
        }

        const newEvent = {
            title,
            date,
            description,
        };

        saveEvent(newEvent);
        renderEvents();

        eventForm.reset();
        alert("Evento criado com sucesso!");
    });

    backButton.addEventListener("click", () => {
        window.location.href = "/pages/catequista.html";
    });

    renderEvents();
});
