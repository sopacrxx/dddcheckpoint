// Função para buscar e listar todos os projetos 
async function fetchProjetos() {
    try {
        const response = await fetch('/api/projetos');
        if (!response.ok) throw new Error('Erro ao buscar projetos.');

        const text = await response.text(); // Lê a resposta como texto
        const projetos = text ? JSON.parse(text) : []; // Tenta analisar, se estiver vazio, usa array vazio
        const projetosList = document.getElementById('projetos-list');
        projetosList.innerHTML = '';

        projetos.forEach(projeto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${projeto.id}</td>
                <td>${projeto.nome}</td>
                <td>${projeto.descricao}</td>
                <td>${projeto.data_inicio}</td>
                <td>${projeto.data_fim}</td>
                <td>${projeto.status}</td>
                <td>
                    <button onclick="editarProjeto(${projeto.id})" class="btn btn-warning btn-sm">Editar</button>
                    <button onclick="deletarProjeto(${projeto.id})" class="btn btn-danger btn-sm">Excluir</button>
                </td>
            `;
            projetosList.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Função para validar datas
function validarDatas(dataInicio, dataFim) {
    return new Date(dataInicio) <= new Date(dataFim);
}

// Função para salvar ou atualizar um projeto
async function salvarProjeto(event) {
    event.preventDefault();
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const data_inicio = document.getElementById("data_inicio").value;
    const data_fim = document.getElementById("data_fim").value;
    const status = document.getElementById("status").value;

    // Validação das datas
    if (!validarDatas(data_inicio, data_fim)) {
        alert('A data de início deve ser anterior à data de término.');
        return;
    }

    const projeto = { nome, descricao, data_inicio, data_fim, status };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/projetos/${id}` : '/api/projetos';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projeto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText); // Log da resposta de erro
            throw new Error(errorText || 'Erro ao salvar o projeto.');
        }

        alert(id ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
        limparFormulario();
        fetchProjetos(); // Atualiza a lista após salvar
    } catch (error) {
        alert(error.message);
    }
}

// Função para editar um projeto (carregar dados no formulário)
async function editarProjeto(id) {
    try {
        const response = await fetch(`/api/projetos/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar projeto.');

        const projeto = await response.json();
        document.getElementById("id").value = projeto.id;
        document.getElementById("nome").value = projeto.nome;
        document.getElementById("descricao").value = projeto.descricao;
        document.getElementById("data_inicio").value = projeto.data_inicio;
        document.getElementById("data_fim").value = projeto.data_fim;
        document.getElementById("status").value = projeto.status;
    } catch (error) {
        alert(error.message);
    }
}

// Função para deletar um projeto
async function deletarProjeto(id = null) {
    id = id || document.getElementById("id").value;

    if (id) {
        try {
            const response = await fetch(`/api/projetos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir projeto.');
            
            alert('Projeto excluído com sucesso!');
            limparFormulario();
            fetchProjetos(); // Atualiza a lista após excluir
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('Selecione um projeto para excluir.');
    }
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById("id").value = '';
    document.getElementById("nome").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("data_inicio").value = '';
    document.getElementById("data_fim").value = '';
    document.getElementById("status").value = 'planejado';
}

// Carrega os projetos na inicialização da página
fetchProjetos();
