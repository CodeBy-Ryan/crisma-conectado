document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const postsList = document.getElementById("postsList");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.getElementById("fileInput");
    const logoutButton = document.getElementById("logoutButton");

    // Verificar se o usuário está logado
    if (!loggedInUser) {
        alert("Acesso restrito! Faça login novamente.");
        window.location.href = "/pages/login.html";
        return;
    }

    // Logout do usuário (não deslogar, mas voltar para a tela inicial correta)
    logoutButton.addEventListener("click", () => {
        if (loggedInUser.role === "catequista") {
            window.location.href = "/pages/catequista.html"; // Direciona para a página inicial do catequista
        } else if (loggedInUser.role === "aluno") {
            window.location.href = "/pages/turmainterna.html"; // Direciona para a página inicial do aluno
        }
    });

    // Enviar mensagem
    sendButton.addEventListener("click", () => {
        const messageText = messageInput.value.trim();
        if (messageText === "" && !fileInput.files.length) return;

        const newPost = {
            username: loggedInUser.name,
            role: loggedInUser.role,
            profilePic: loggedInUser.profilePic,
            turma: loggedInUser.turma, // Adicionando a turma
            message: messageText,
            timestamp: new Date().toISOString(),
            file: fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : null,
        };

        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        messageInput.value = "";
        fileInput.value = "";
        loadPosts();
    });

    // Função para formatar a data e a hora
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("pt-BR", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Carregar mensagens
    const loadPosts = () => {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        postsList.innerHTML = "";

        // Ordenar as mensagens para mostrar as mais recentes no final
        posts.reverse().forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <div class="postHeader">
                    <img src="${post.profilePic}" alt="Foto de perfil" class="profilePic">
                    <div>
                        <div class="username">${post.username}</div>
                        <div class="role">${post.role} - ${post.turma}</div>
                    </div>
                </div>
                <div class="message">${post.message}</div>
                ${post.file ? `<img src="${post.file}" alt="Mídia" class="postMedia" />` : ""}
                <div class="postActions">
                    <div class="timestamp">${formatDate(post.timestamp)}</div>
                    ${loggedInUser.role === "catequista" ? `<button class="deleteButton">Excluir</button>` : ""}
                </div>
            `;

            postsList.appendChild(postElement);
        });

        // Adicionar funcionalidade de excluir para catequistas
        document.querySelectorAll(".deleteButton").forEach(button => {
            button.addEventListener("click", (e) => {
                const postElement = e.target.closest(".post");
                const message = postElement.querySelector(".message").innerText;

                let posts = JSON.parse(localStorage.getItem("posts")) || [];
                posts = posts.filter(post => post.message !== message);
                localStorage.setItem("posts", JSON.stringify(posts));

                loadPosts();
            });
        });
    };

    loadPosts();
});
