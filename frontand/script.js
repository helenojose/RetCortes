let agendamentos = [];  // Lista para armazenar os agendamentos 
let horariosOcupados = [];  // Lista para armazenar os horários ocupados

document.getElementById("data").addEventListener("change", function() {
    atualizarHorarios();
});

// Atualiza o valor total quando o serviço é alterado
document.getElementById("servico").addEventListener("change", function() {
    const servicoSelect = document.getElementById("servico");
    const valor = servicoSelect.value;
    document.getElementById("valorTotal").textContent = parseFloat(valor).toFixed(2);
});

// Função para atualizar os horários disponíveis
function atualizarHorarios() {
    const dataEscolhida = document.getElementById("data").value;

    // Buscar os agendamentos do backend
    fetch('http://localhost:3000/appointments')
        .then(response => response.json())
        .then(data => {
            // Filtra os agendamentos com a data escolhida
            const agendamentosDia = data.agendamentos.filter(agendamento => agendamento.data === dataEscolhida);
            horariosOcupados = agendamentosDia.map(agendamento => agendamento.hora);
            exibirHorarios();
        });
}

// Função para exibir os horários disponíveis
function exibirHorarios() {
    const horariosDisponiveis = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    const horaSelect = document.getElementById("hora");

    // Limpa as opções de horários anteriores
    horaSelect.innerHTML = '<option value="" disabled selected>Selecione a hora</option>';

    // Adiciona os horários disponíveis
    horariosDisponiveis.forEach(hora => {
        if (!horariosOcupados.includes(hora)) {
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
        }
    });
}

// Processa o envio do formulário de agendamento
document.getElementById("agendamentoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servicoSelect = document.getElementById("servico");
    const servicoTexto = servicoSelect.options[servicoSelect.selectedIndex].text;
    const valorTotal = servicoSelect.value;

    if (nome && data && hora && servicoSelect.value) {
        const novoAgendamento = { nome, data, hora, servico: servicoTexto, valor: valorTotal };

        // Adiciona o agendamento à lista
        agendamentos.push(novoAgendamento);

        // Envia os dados para o backend
        fetch('http://localhost:3000/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAgendamento)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Agendamento realizado:", data);
            atualizarHorarios(); // Atualiza os horários disponíveis
        });

        // Limpa o formulário
        document.getElementById("agendamentoForm").reset();
    }
});

