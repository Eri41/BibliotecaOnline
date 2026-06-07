const API = "http://localhost:3000";

let token = "";

async function login() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch(`${API}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            senha
        })

    });

    const dados = await resposta.json();

    token = dados.token;

    alert("Login realizado!");

    listarLivros();
}

async function listarLivros() {

    const resposta = await fetch(`${API}/livros`, {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    const livros = await resposta.json();

    const div = document.getElementById("livros");

    div.innerHTML = "";

    livros.forEach(livro => {

        div.innerHTML += `
            <div class="livro">
                <strong>${livro.titulo}</strong>
                <br>
                Ano: ${livro.ano}
                <br>
                Estoque: ${livro.quantidade_estoque}
                <br>
                Categoria: ${livro.id_categoria}
                <br><br>

                <button onclick="excluirLivro(${livro.id_livro})">
                    Excluir
                </button>
            </div>
        `;
    });
}

async function cadastrarLivro() {

    const titulo = document.getElementById("titulo").value;
    const ano = document.getElementById("ano").value;
    const quantidade_estoque =
        document.getElementById("estoque").value;
    const id_categoria =
        document.getElementById("categoria").value;

    await fetch(`${API}/livros`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            titulo,
            ano,
            quantidade_estoque,
            id_categoria
        })

    });

    alert("Livro cadastrado!");

    listarLivros();
}

async function excluirLivro(id) {

    await fetch(`${API}/livros/${id}`, {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    listarLivros();
}