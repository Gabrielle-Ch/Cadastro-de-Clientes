// Usa map() para transformar a lista de clientes em elementos HTML
export function gerarListaHTML(clientes) {
    return clientes.map(cliente => {
        return `
            <li>
                ${cliente.nome} - ${cliente.email}
                <button onclick="editarCliente('${cliente._id}', '${cliente.nome}', '${cliente.email}')">Editar</button>
                <button onclick="excluirCliente('${cliente._id}')">Excluir</button>
            </li>
        `;
    }).join('');
}

// Usa reduce() para contar domínios de e-mail cadastrados
export function contarDominiosEmail(clientes) {
    return clientes.reduce((acc, cliente) => {
        const dominio = cliente.email.split('@')[1];
        acc[dominio] = (acc[dominio] || 0) + 1;
        return acc;
    }, {});
}

// Usa find() para localizar um cliente pelo ID
export function encontrarClientePorId(clientes, id) {
    return clientes.find(cliente => cliente._id === id);
}