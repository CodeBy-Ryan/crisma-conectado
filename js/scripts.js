// Alternar para o formulário de cadastro
document.getElementById("signup-link").addEventListener("click", () => {
    document.querySelector(".login-form").classList.add("hidden");
    document.querySelector(".signup-form").classList.remove("hidden");
});

// Alternar para o formulário de login
document.getElementById("login-link").addEventListener("click", () => {
    document.querySelector(".signup-form").classList.add("hidden");
    document.querySelector(".login-form").classList.remove("hidden");
});

// Adicionando validação de tipo de usuário no login
document.querySelector(".login-form form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simulação de login - ajuste para uso real com backend
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // Verifica se o usuário está bloqueado
        if (user.blocked) {
            alert("Sua conta está bloqueada. Entre em contato com o administrador.");
            return;
        }

        // Salva informações do usuário no localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (user.role === "aluno") {
            window.location.href = "/pages/turmainterna.html"; // Redireciona para a turma interna do aluno
        } else if (user.role === "catequista") {
            if (user.approved) {
                window.location.href = "/pages/catequista.html"; // Redireciona para a área do catequista
            } else {
                alert("Seu cadastro ainda não foi aprovado. Por favor, aguarde.");
                localStorage.removeItem("loggedInUser");
                window.location.href = "/pages/login.html"; // Volta para a tela de login
            }
        } else {
            alert("Usuário ou função inválida.");
        }
    } else {
        alert("E-mail ou senha inválidos.");
    }
});

// Salvar usuários no localStorage ao cadastrar
document.querySelector(".signup-form form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const role = document.getElementById("role").value;
    const turma = document.getElementById("turma")?.value || ""; // Turma é opcional para catequistas

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Verifica se o e-mail já foi cadastrado
    if (users.some((u) => u.email === email)) {
        alert("E-mail já cadastrado. Por favor, use outro e-mail.");
        return;
    }

    const newUser = { 
        name, 
        email, 
        password, 
        role, 
        turma, 
        approved: role === "catequista" ? false : true,
        blocked: false // Novo campo para indicar se o usuário está bloqueado
    };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Cadastro realizado com sucesso! Aguarde aprovação se você for um catequista.");
    document.getElementById("login-link").click(); // Voltar para o login
});

// Validação de acesso às áreas restritas
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Restringir acesso às páginas específicas
    if (window.location.pathname.includes("turmainterna.html") && (!user || user.role !== "aluno")) {
        alert("Acesso restrito! Somente alunos podem acessar esta área.");
        window.location.href = "/pages/login.html";
    }

    if (window.location.pathname.includes("catequista.html") && (!user || user.role !== "catequista" || !user.approved)) {
        alert("Acesso restrito! Somente catequistas aprovados podem acessar esta área.");
        window.location.href = "/pages/login.html";
    }
});

// Carregar turmas dinamicamente no cadastro
document.addEventListener("DOMContentLoaded", () => {
    const turmaSelect = document.getElementById("turma");

    if (turmaSelect) {
        // Turmas padrão
        const defaultTurmas = [
            { name: "São Bento", id: "sao-bento" },
            { name: "Santa Clara", id: "santa-clara" },
            { name: "São Francisco", id: "sao-francisco" },
        ];

        // Obter turmas cadastradas do localStorage
        const storedTurmas = JSON.parse(localStorage.getItem("classes")) || [];
        const allTurmas = [...defaultTurmas, ...storedTurmas];

        // Preencher o select de turmas
        turmaSelect.innerHTML = ""; // Limpa o select
        allTurmas.forEach((turma) => {
            const option = document.createElement("option");
            option.value = turma.id || turma.name.toLowerCase().replace(/\s+/g, "-");
            option.textContent = turma.name;
            turmaSelect.appendChild(option);
        });
    }
});

// Logout
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/pages/login.html";
    });
};

// Abrir modal de recuperação de senha
document.getElementById("forgot-password").addEventListener("click", () => {
    document.getElementById("reset-password-modal").style.display = "block";
});

// Fechar o modal
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("reset-password-modal").style.display = "none";
});

// Processo de recuperação de senha
document.getElementById("reset-password-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("reset-email").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);

    const resetMessage = document.getElementById("reset-message");

    if (user) {
        // Enviar um link de recuperação de senha (aqui estamos apenas simulando)
        resetMessage.textContent = "Um link para recuperação da sua senha foi enviado para o seu e-mail!";
        resetMessage.classList.remove("hidden");

        // Aqui você poderia realmente enviar um e-mail com um link, mas como estamos simulando:
        setTimeout(() => {
            // Agora mostramos o formulário para alterar a senha
            resetMessage.textContent = "Agora você pode criar uma nova senha.";
            const newPasswordForm = document.createElement("form");
            const newPasswordLabel = document.createElement("label");
            newPasswordLabel.textContent = "Nova Senha:";
            const newPasswordInput = document.createElement("input");
            newPasswordInput.type = "password";
            newPasswordInput.id = "new-password";
            newPasswordInput.required = true;
            const submitButton = document.createElement("button");
            submitButton.type = "submit";
            submitButton.textContent = "Alterar Senha";
            newPasswordForm.appendChild(newPasswordLabel);
            newPasswordForm.appendChild(newPasswordInput);
            newPasswordForm.appendChild(submitButton);
            resetMessage.appendChild(newPasswordForm);

            newPasswordForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const newPassword = newPasswordInput.value;

                // Atualizar a senha do usuário
                user.password = newPassword;
                localStorage.setItem("users", JSON.stringify(users));

                resetMessage.textContent = "Sua senha foi alterada com sucesso!";
                newPasswordForm.remove();
            });
        }, 2000);

    } else {
        resetMessage.textContent = "Este e-mail não está cadastrado. Por favor, tente novamente.";
        resetMessage.classList.remove("hidden");
    }
});
