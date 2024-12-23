document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButton");
    const turmaNameElement = document.getElementById("turmaName");
    const studentListElement = document.getElementById("studentList");
    const saveAttendanceButton = document.getElementById("saveAttendance");
    const attendanceHistoryElement = document.getElementById("attendanceHistory");
    const filterInput = document.getElementById("filterAttendance");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const turmaName = loggedInUser?.turma;
    turmaNameElement.textContent = turmaName || "Turma não definida";

    const students = JSON.parse(localStorage.getItem("users"))?.filter(
        (user) => user.role === "aluno" && user.turma === turmaName
    );

    if (!students || students.length === 0) {
        studentListElement.innerHTML = `
            <tr>
                <td colspan="3">Nenhum aluno cadastrado nesta turma.</td>
            </tr>
        `;
        return;
    }

    const populateStudentTable = () => {
        studentListElement.innerHTML = "";
        students.forEach((student) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.name}</td>
                <td><input type="checkbox" class="presenceCheckbox"></td>
                <td><input type="checkbox" class="absenceCheckbox"></td>
            `;
            studentListElement.appendChild(row);
        });
    };

    populateStudentTable();

    saveAttendanceButton.addEventListener("click", () => {
        const rows = document.querySelectorAll("#studentList tr");
        const attendance = [];
        rows.forEach((row, index) => {
            const name = students[index].name;
            const present = row.querySelector(".presenceCheckbox").checked;
            const absent = row.querySelector(".absenceCheckbox").checked;

            attendance.push({ name, present, absent });
        });

        const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || {};
        if (!attendanceData[turmaName]) {
            attendanceData[turmaName] = [];
        }

        const newEntry = {
            date: new Date().toLocaleString("pt-BR"),
            attendance,
        };

        attendanceData[turmaName].unshift(newEntry); // Adiciona no início para manter os mais recentes no topo
        localStorage.setItem("attendanceData", JSON.stringify(attendanceData));

        alert("Lista de chamada salva com sucesso!");
        renderAttendanceHistory();
    });

    const renderAttendanceHistory = () => {
        const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || {};
        const turmaHistory = attendanceData[turmaName] || [];

        attendanceHistoryElement.innerHTML = "";
        turmaHistory.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "attendanceEntry";
            entryDiv.innerHTML = `
                <p><strong>Data:</strong> ${entry.date}</p>
                <button class="downloadButton" data-index="${index}">Baixar PDF</button>
                <button class="deleteButton" data-index="${index}">Apagar</button>
            `;
            attendanceHistoryElement.appendChild(entryDiv);
        });

        document.querySelectorAll(".downloadButton").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                generatePdf(turmaHistory[index]);
            });
        });

        document.querySelectorAll(".deleteButton").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                turmaHistory.splice(index, 1);
                localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
                renderAttendanceHistory();
            });
        });
    };

    const generatePdf = (entry) => {
        try {
            const { jsPDF } = window.jspdf; // Obtendo o jsPDF do objeto global
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text(`Lista de Chamadas - Turma: ${turmaName}`, 10, 10);
            doc.setFontSize(12);
            doc.text(`Data: ${entry.date}`, 10, 20);

            let yPosition = 40;
            entry.attendance.forEach((student) => {
                doc.text(`${student.name}`, 10, yPosition);
                doc.text(`Presente: ${student.present ? "Sim" : "Não"}`, 80, yPosition);
                doc.text(`Ausente: ${student.absent ? "Sim" : "Não"}`, 140, yPosition);
                yPosition += 10;
            });

            doc.save(`Lista_Chamada_${turmaName}_${entry.date.replace(/[/: ]/g, "_")}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
            alert("Erro ao gerar o PDF. Tente novamente mais tarde.");
        }
    };

    filterInput.addEventListener("input", () => {
        const query = filterInput.value.toLowerCase();
        const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || {};
        const turmaHistory = attendanceData[turmaName] || [];

        const filteredHistory = turmaHistory.filter((entry) =>
            entry.date.toLowerCase().includes(query)
        );

        attendanceHistoryElement.innerHTML = "";
        filteredHistory.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "attendanceEntry";
            entryDiv.innerHTML = `
                <p><strong>Data:</strong> ${entry.date}</p>
                <button class="downloadButton" data-index="${index}">Baixar PDF</button>
            `;
            attendanceHistoryElement.appendChild(entryDiv);
        });
    });

    renderAttendanceHistory();

    backButton.addEventListener("click", () => {
        window.location.href = "/pages/catequista.html";
    });
});
