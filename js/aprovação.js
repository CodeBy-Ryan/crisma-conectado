document.addEventListener("DOMContentLoaded", () => {
    const alunosTable = document.getElementById("alunosTable");
    const catequistasTable = document.getElementById("catequistasTable");
    const searchInput = document.getElementById("searchInput");

    // Tabs
    const tabs = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
        });
    });

    // Carregar usuários do localStorage
    const loadUsers = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Separar alunos e catequistas
        const alunos = users.filter((user) => user.role === "aluno");
        const catequistas = users.filter((user) => user.role === "catequista");

        renderTable(alunos, alunosTable, "aluno");
        renderTable(catequistas, catequistasTable, "catequista");
    };

    // Renderizar tabelas com turma
    const renderTable = (users, table, role) => {
        table.innerHTML = "";

        users.forEach((user) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.turma || "Não atribuída"}</td>
                ${
                    role === "catequista"
                        ? `<td>${user.approved ? "Aprovado" : "Pendente"}</td>`
                        : ""
                }
                <td>
                    ${
                        role === "catequista" && !user.approved
                            ? `<button class="approve" data-id="${user.email}">Aprovar</button>`
                            : ""
                    }
                    <button class="block" data-id="${user.email}">${
                        user.blocked ? "Desbloquear" : "Bloquear"
                    }</button>
                    <button class="delete" data-id="${user.email}">Excluir</button>
                </td>
            `;

            table.appendChild(row);
        });
    };

    // Aprovar, bloquear ou excluir usuário
    const handleAction = (event) => {
        if (!event.target.tagName === "BUTTON") return;

        const action = event.target.className;
        const email = event.target.getAttribute("data-id");
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === email);

        if (action === "approve") {
            user.approved = true;
        } else if (action === "block") {
            user.blocked = !user.blocked;
        } else if (action === "delete") {
            const index = users.findIndex((u) => u.email === email);
            users.splice(index, 1);
        }

        localStorage.setItem("users", JSON.stringify(users));
        loadUsers();
    };

    // Pesquisa de usuários
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const alunos = users.filter((user) => user.role === "aluno" && (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)));
        const catequistas = users.filter((user) => user.role === "catequista" && (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)));

        renderTable(alunos, alunosTable, "aluno");
        renderTable(catequistas, catequistasTable, "catequista");
    });

    // Eventos
    alunosTable.addEventListener("click", handleAction);
    catequistasTable.addEventListener("click", handleAction);

    // Carregar dados na inicialização
    loadUsers();
});
