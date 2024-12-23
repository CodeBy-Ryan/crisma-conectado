document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Verifica se o usuário é um catequista aprovado
    if (!loggedInUser || loggedInUser.role !== "catequista" || !loggedInUser.approved) {
        alert("Acesso restrito! Apenas catequistas aprovados podem acessar esta área.");
        window.location.href = "login.html";
        return;
    }

    // Define o nome e a turma do catequista
    document.getElementById("catequistaName").textContent = loggedInUser.name;
    document.getElementById("catequistaTurma").textContent = loggedInUser.turma;

    // Carregar alunos da turma do catequista com fotos atualizadas
    const alunosContainer = document.getElementById("alunosContainer");
    const alunos = JSON.parse(localStorage.getItem("users")) || [];
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; // Lista de tarefas criadas
    const alunosDaTurma = alunos.filter((aluno) => aluno.role === "aluno" && aluno.turma === loggedInUser.turma);

    if (alunosDaTurma.length === 0) {
        alunosContainer.innerHTML = "<p>Nenhum aluno cadastrado nesta turma.</p>";
    } else {
        alunosContainer.innerHTML = "";

        alunosDaTurma.forEach((aluno) => {
            // Criar o card do aluno
            const alunoCard = document.createElement("div");
            alunoCard.classList.add("aluno-card");

            // Adicionar a foto do perfil atualizada
            const alunoFoto = document.createElement("img");
            alunoFoto.src = aluno.profilePic || "https://via.placeholder.com/150"; // Substituir com a foto do aluno ou padrão
            alunoFoto.alt = `Foto de ${aluno.name}`;
            alunoFoto.classList.add("aluno-foto");

            // Adicionar nome e e-mail do aluno
            const alunoInfo = document.createElement("div");
            alunoInfo.classList.add("aluno-info");
            alunoInfo.innerHTML = `
                <h3>${aluno.name}</h3>
                <p>${aluno.email}</p>
            `;

            // Status das atividades do aluno
            const alunoTarefas = document.createElement("ul");
            alunoTarefas.classList.add("aluno-tarefas");

            // Filtrar tarefas da turma e verificar se foram concluídas
            const tarefasDaTurma = tarefas.filter((tarefa) => tarefa.turma === loggedInUser.turma);
            if (tarefasDaTurma.length === 0) {
                alunoTarefas.innerHTML = "<li>Nenhuma tarefa atribuída ainda.</li>";
            } else {
                tarefasDaTurma.forEach((tarefa) => {
                    const tarefaItem = document.createElement("li");
                    const concluida = aluno.tarefasConcluidas && aluno.tarefasConcluidas.includes(tarefa.id);
                    tarefaItem.innerHTML = `${tarefa.titulo} - <strong>${concluida ? "Concluída" : "Pendente"}</strong>`;
                    alunoTarefas.appendChild(tarefaItem);
                });
            }

            // Montar o card do aluno
            alunoCard.appendChild(alunoFoto);
            alunoCard.appendChild(alunoInfo);
            alunoCard.appendChild(alunoTarefas);
            alunosContainer.appendChild(alunoCard);
        });
    }

    // Funções dos botões
    document.getElementById("btnListaChamada").addEventListener("click", () => {
        window.location.href = "/pages/chamadas.html";
    });


    document.getElementById("btnCriarEvento").addEventListener("click", () => {
        window.location.href = "/pages/criareventos.html";
    });

    document.getElementById("btnBatePapo").addEventListener("click", () => {
        window.location.href = "/pages/chat.html";
    });

    document.getElementById("btnNovaTurma").addEventListener("click", () => {
        window.location.href = "/pages/novaturma.html";
    });

    document.getElementById("btnCadastrarGrupos").addEventListener("click", () => {
        window.location.href = "/pages/cadastrargrupos.html";
    });

    document.getElementById("btnEditarPerfil").addEventListener("click", () => {
        window.location.href = "/pages/editar_perfil.html";
    });

    // Botão de logout
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/pages/login.html";
    });
});
