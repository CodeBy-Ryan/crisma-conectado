document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const groupList = document.getElementById("groupList");
    const createGroupForm = document.getElementById("createGroupForm");
    const backButton = document.getElementById("backButton");

    // Verificar se o usuário está logado
    if (!loggedInUser) {
        alert("Acesso restrito! Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    // Botão Voltar
    backButton.addEventListener("click", () => {
        if (loggedInUser.role === "catequista") {
            window.location.href = "/pages/catequista.html";
        } else if (loggedInUser.role === "aluno") {
            window.location.href = "/pages/turmainterna.html";
        } else {
            alert("Usuário inválido.");
            window.location.href = "/pages/login.html";
        }
    });

    // Carregar grupos existentes para a turma
    const loadGroups = () => {
        const groups = JSON.parse(localStorage.getItem("grupos")) || [];
        const turmaGroups = groups.filter(group => group.turma === loggedInUser.turma);

        groupList.innerHTML = "";

        if (turmaGroups.length === 0) {
            groupList.innerHTML = "<p>Sem grupos cadastrados para esta turma.</p>";
        } else {
            turmaGroups.forEach(group => {
                const groupCard = document.createElement("div");
                groupCard.className = "groupCard";
                groupCard.innerHTML = `
                    <h3>${group.name}</h3>
                    <p><a href="${group.link}" target="_blank">Entrar no grupo</a></p>
                `;

                // Adicionar botão de exclusão apenas para catequistas
                if (loggedInUser.role === "catequista") {
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Excluir";
                    deleteButton.className = "deleteButton";
                    deleteButton.addEventListener("click", () => deleteGroup(group.name));
                    groupCard.appendChild(deleteButton);
                }

                groupList.appendChild(groupCard);
            });
        }
    };

    // Cadastrar novo grupo
    createGroupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const groupName = document.getElementById("groupName").value;
        const groupLink = document.getElementById("groupLink").value;

        const newGroup = {
            name: groupName,
            link: groupLink,
            turma: loggedInUser.turma,
            createdBy: loggedInUser.name,
        };

        const groups = JSON.parse(localStorage.getItem("grupos")) || [];
        groups.push(newGroup);
        localStorage.setItem("grupos", JSON.stringify(groups));

        alert("Grupo cadastrado com sucesso!");
        createGroupForm.reset();
        loadGroups();
    });

    // Excluir grupo
    const deleteGroup = (groupName) => {
        let groups = JSON.parse(localStorage.getItem("grupos")) || [];
        groups = groups.filter(group => group.name !== groupName || group.turma !== loggedInUser.turma);
        localStorage.setItem("grupos", JSON.stringify(groups));
        alert("Grupo excluído com sucesso!");
        loadGroups();
    };

    // Inicializar
    loadGroups();
});
