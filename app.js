import { Cliente } from './classes.js';
import { gerarListaHTML, contarDominiosEmail, encontrarClientePorId } from './utils.js';

console.log("JS carregado!");

const apiUrl = 'https://crudcrud.com/api/e7d83dde399040ee8b025d6d3ecc7b49/clientes';
const form = document.getElementById('cliente-form');
let editandoId = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarClientes();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nome || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    const cliente = new Cliente(nome, email);

    try {
        if (editandoId) {
            await fetch(`${apiUrl}/${editandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });
            editandoId = null;
        } else {
            // Usando find() para verificar se já existe um cliente com o mesmo e-mail
            const clientes = await carregarClientes(true); // Passando true para retornar a lista de clientes
            const clienteExistente = clientes.find(c => c.email === email);
            if (clienteExistente) {
                alert("Já existe um cliente com esse e-mail!");
                return;
            }

            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });
        }

        form.reset();
        carregarClientes();
    } catch (error) {
        console.error("Erro ao cadastrar/atualizar cliente:", error);
    }
});

async function carregarClientes(retornarClientes = false) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao carregar clientes");

        const clientes = await response.json();

        // Exibe a lista na tela com map()
        const lista = document.getElementById('clientes-lista');
        lista.innerHTML = gerarListaHTML(clientes);

        // Exibe contagem de domínios com reduce()
        const contagem = contarDominiosEmail(clientes);
        console.log("Contagem de domínios de e-mail:", contagem);

        // Exemplo de uso de reduce() para contar quantos clientes no total
        const totalClientes = clientes.reduce((acc) => acc + 1, 0);
        console.log(`Total de clientes cadastrados: ${totalClientes}`);

        if (retornarClientes) return clientes;

    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
    }
}

window.excluirCliente = async function(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarClientes();
    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
    }
}

window.editarCliente = function(id, nome, email) {
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    editandoId = id;
}