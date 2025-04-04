console.log("JS carregado!"); // Testa se o script está rodando corretamente

const apiUrl = 'https://crudcrud.com/api/e04057ef52bc43d38ed6fe2858798709/clientes';

document.addEventListener("DOMContentLoaded", () => { carregarClientes(); });

const form = document.getElementById('cliente-form'); let editandoId = null; // Declaração da variável editandoId

form.addEventListener('submit', async (event) => { event.preventDefault(); const nome = document.getElementById('nome').value.trim(); const email = document.getElementById('email').value.trim();

if (!nome || !email) {
    alert("Preencha todos os campos!");
    return;
}

try {
    if (editandoId) {
        // Atualizar cliente existente
        await fetch(`${apiUrl}/${editandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email })
        });
        editandoId = null; // Reseta o ID após atualizar
    } else {
        // Cadastrar novo cliente
        await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email })
        });
    }

    form.reset();
    carregarClientes();
} catch (error) {
    console.error("Erro ao cadastrar/atualizar cliente:", error);
}

});

async function carregarClientes() { try { const response = await fetch(apiUrl); if (!response.ok) throw new Error("Erro ao carregar clientes");

const clientes = await response.json();
    const lista = document.getElementById('clientes-lista');
    lista.innerHTML = '';

    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${cliente.nome} - ${cliente.email} 
            <button onclick="editarCliente('${cliente._id}', '${cliente.nome}', '${cliente.email}')">Editar</button>
            <button onclick="excluirCliente('${cliente._id}')">Excluir</button>
        `;
        lista.appendChild(li);
    });
} catch (error) {
    console.error("Erro ao carregar clientes:", error);
}

}

async function excluirCliente(id) {
     try { await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      carregarClientes(); } catch (error) { console.error("Erro ao excluir cliente:", error);
        
       } }

function editarCliente(id, nome, email) {
     document.getElementById('nome').value = nome;
      document.getElementById('email').value = email;
       editandoId = id; // Guarda o ID para atualização 
       }