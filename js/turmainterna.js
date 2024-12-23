document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || loggedInUser.role !== "aluno") {
        alert("Acesso restrito! Apenas alunos podem acessar esta área.");
        window.location.href = "/Pages/login.html";
        return;
    }

    // Atualizar título da turma e boas-vindas
    document.getElementById("turmaTitle").textContent = `Turma ${loggedInUser.turma}`;
    document.getElementById("welcomeTitle").textContent = `Olá, ${loggedInUser.name}!`;

    // Carregar membros da turma com fotos atualizadas
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const members = users.filter((user) => user.turma === loggedInUser.turma && user.role === "aluno");
    const membersContainer = document.getElementById("membersContainer");
    membersContainer.innerHTML = members.map(member => `
        <div class="card">
            <img src="${member.profilePic || 'https://via.placeholder.com/100'}" alt="Foto de ${member.name}">
            <h3>${member.name}</h3>
            <p>${member.email}</p>
        </div>
    `).join("");

    // Carregar tarefas da turma
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const tasksContainer = document.getElementById("tasksContainer");
    const tasks = tarefas.filter((tarefa) => tarefa.turma === loggedInUser.turma);
    tasksContainer.innerHTML = tasks.length > 0 ? tasks.map(task => `
        <div class="card">
            <h3>${task.titulo}</h3>
            <p>${task.descricao}</p>
            <p>Prazo: ${task.prazo}</p>
        </div>
    `).join("") : "<p>Sem tarefas no momento.</p>";

    // Carregar eventos da turma
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const eventsContainer = document.getElementById("eventsContainer");
    const events = eventos.filter((evento) => evento.turma === loggedInUser.turma);
    eventsContainer.innerHTML = events.length > 0 ? events.map(event => `
        <div class="card">
            <h3>${event.titulo}</h3>
            <p>${event.descricao}</p>
            <p>Data: ${event.data}</p>
        </div>
    `).join("") : "<p>Sem eventos no momento.</p>";

    // Carregar grupos da turma
    const grupos = JSON.parse(localStorage.getItem("grupos")) || [];
    const groupsContainer = document.getElementById("groupsContainer");
    const groups = grupos.filter((grupo) => grupo.turma === loggedInUser.turma);
    groupsContainer.innerHTML = groups.length > 0 ? groups.map(group => `
        <div class="card">
            <h3>${group.nome}</h3>
            <p>${group.descricao}</p>
        </div>
    `).join("") : "<p>Sem grupos no momento.</p>";

    // Logout
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/Pages/login.html";
    });
});
