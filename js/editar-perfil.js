document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const turmas = JSON.parse(localStorage.getItem("turmas")) || {};

    if (!loggedInUser) {
        alert("Acesso restrito! Faça login novamente.");
        window.location.href = "/Pages/login.html";
        return;
    }

    // Preenche os campos com os dados do usuário logado
    document.getElementById("name").value = loggedInUser.name;
    document.getElementById("email").value = loggedInUser.email;
    if (loggedInUser.profilePic) {
        document.getElementById("profilePicPreview").src = loggedInUser.profilePic;
    }

    // Atualiza a foto de perfil ao selecionar um arquivo
    document.getElementById("profilePic").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("profilePicPreview").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Salva as alterações feitas no perfil
    document.getElementById("editarPerfilForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedName = document.getElementById("name").value;
        const updatedPassword = document.getElementById("password").value;
        const updatedProfilePic = document.getElementById("profilePicPreview").src;

        // Localiza o índice do usuário no localStorage
        const userIndex = users.findIndex((u) => u.email === loggedInUser.email);

        if (userIndex !== -1) {
            // Atualiza os dados do usuário
            users[userIndex] = {
                ...users[userIndex],
                name: updatedName,
                password: updatedPassword || users[userIndex].password,
                profilePic: updatedProfilePic,
            };

            // Atualiza as turmas com a nova foto/nome
            Object.keys(turmas).forEach((turma) => {
                turmas[turma] = turmas[turma].map((aluno) => {
                    if (aluno.email === loggedInUser.email) {
                        return {
                            ...aluno,
                            name: updatedName,
                            profilePic: updatedProfilePic,
                        };
                    }
                    return aluno;
                });
            });

            // Salva as alterações no localStorage
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));
            localStorage.setItem("turmas", JSON.stringify(turmas));

            alert("Perfil atualizado com sucesso!");
            window.location.reload(); // Atualiza a página para refletir as mudanças
        } else {
            alert("Erro ao atualizar perfil. Usuário não encontrado.");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("Acesso restrito! Faça login novamente.");
        window.location.href = "/Pages/login.html";
        return;
    }

    // Ação do botão "Voltar"
    document.getElementById("backButton").addEventListener("click", (event) => {
        event.preventDefault();

        // Redireciona com base no tipo de usuário
        if (loggedInUser.role === "catequista") {
            window.location.href = "/catequista.html";
        } else if (loggedInUser.role === "aluno") {
            window.location.href = "/turmainterna.html";
        } else {
            alert("Tipo de usuário inválido. Redirecionando para o login.");
            window.location.href = "/Pages/login.html";
        }
    });

    // Preenchimento e manipulação do perfil (já presente no código anterior)
    // ...
});
