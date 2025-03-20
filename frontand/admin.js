// Função para formatar a data para o formato brasileiro dd/mm/aaaa
function formatarData(data) {
    const partes = data.split("-"); // Supondo que a data esteja no formato yyyy-mm-dd
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Formato dd/mm/aaaa
}

// Função para buscar os agendamentos e exibir na lista
function exibirAgendamentos() {
    fetch('http://localhost:3000/appointments')  // URL para buscar os agendamentos
        .then(response => response.json())
        .then(data => {
            const agendamentos = data.agendamentos;
            const wrapper = document.querySelector(".agendamentos-wrapper");

            // Limpa os agendamentos anteriores
            wrapper.innerHTML = "";

            // Adiciona os agendamentos à lista
            agendamentos.forEach(agendamento => {
                const agendamentoDiv = document.createElement("div");
                agendamentoDiv.classList.add("agendamento");

                // Adicionando nome
                const nomeTag = document.createElement("h2");
                nomeTag.textContent = agendamento.nome;
                agendamentoDiv.appendChild(nomeTag);

                // Adicionando as informações do agendamento
                agendamentoDiv.innerHTML += `
                    <p><span>Data:</span> ${formatarData(agendamento.data)}</p>
                    <p><span>Hora:</span> ${agendamento.hora}</p>
                    <p><span>Serviço:</span> ${agendamento.servico}</p>
                    <p><span>Valor:</span> <span class="valor">R$ ${parseFloat(agendamento.valor).toFixed(2)}</span></p>
                `;

                // Adiciona o agendamento à lista
                wrapper.appendChild(agendamentoDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar agendamentos:', error);
        });
}

// Chama a função para exibir os agendamentos assim que a página for carregada
document.addEventListener("DOMContentLoaded", function() {
    exibirAgendamentos();
});
