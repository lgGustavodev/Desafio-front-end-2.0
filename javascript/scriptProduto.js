document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  const btnAdicionarProduto = document.getElementById('adicionarProduto');
  btnAdicionarProduto.addEventListener('click', adicionarProduto);
}

function adicionarProduto() {
  const container = document.getElementById('produtosContainer');
  const msgSemProdutos = document.getElementById('semProdutosMsg');
  msgSemProdutos.style.display = 'none';

  const produtoDiv = criarProdutoDiv();
  container.appendChild(produtoDiv);

  configurarEventos(produtoDiv);
}

let contadorProduto = 1; 

function adicionarProduto() {
  const container = document.getElementById('produtosContainer');
  const msgSemProdutos = document.getElementById('semProdutosMsg');
  msgSemProdutos.style.display = 'none';

  const produtoDiv = criarProdutoDiv(contadorProduto);
  container.appendChild(produtoDiv);
  configurarEventos(produtoDiv);

  contadorProduto++; 
}

function criarProdutoDiv(numero) {
  const div = document.createElement('div');
  div.classList.add('produto-container');

    div.innerHTML = `
        <h5 style="display: flex; align-items: center; gap: 8px;">
            <img src="assets/iconeProduto.png" alt="Ícone de produto" style="width: 20px; height: 20px; opacity: 0.7;">
            Produto ${numero}
        </h5>
        <div class="row mb-2">
            ${criarCampo('Descrição', 'text', 'descricao', 'col-md-4')}
            ${criarSelectUnidade()}
            ${criarCampo('Quantidade', 'number', 'quantidade', 'col-md-2')}
            ${criarCampo('Valor Unitário', 'number', 'valorUnitario', 'col-md-2', 'step="0.01"')}
            ${criarCampo('Valor Total', 'number', 'valorTotal', 'col-md-2', 'step="0.01" readonly')}
        </div>
        <button type="button" class="btn btn-danger btn-sm mt-2 btn-remover-produto">Remover</button>`;
    return div;
}

function criarCampo(label, type, classe, colunaClasse, extraAttr = '') {
  return `
    <div class="${colunaClasse}">
      <label class="form-label">${label}</label>
      <input type="${type}" ${extraAttr} class="form-control ${classe}">
    </div>
  `;
}

function criarSelectUnidade() {
  return `
    <div class="col-md-2">
      <label class="form-label">Unid.Medida</label>
      <select class="form-select unidade">
        <option value="Unidade">Unid</option>
        <option value="Kg">Kg</option>
        <option value="L">L</option>
      </select>
    </div>
  `;
}

function configurarEventos(produtoDiv) {
  const quantidade = produtoDiv.querySelector('.quantidade');
  const valorUnitario = produtoDiv.querySelector('.valorUnitario');
  const valorTotal = produtoDiv.querySelector('.valorTotal');

  function atualizarTotal() {
    const q = parseFloat(quantidade.value);
    const v = parseFloat(valorUnitario.value);
    valorTotal.value = (!isNaN(q) && !isNaN(v)) ? (q * v).toFixed(2) : '';
  }

  quantidade.addEventListener('input', atualizarTotal);
  valorUnitario.addEventListener('input', atualizarTotal);

  produtoDiv.querySelector('.btn-remover-produto').addEventListener('click', () => {
    produtoDiv.remove();
    const container = document.getElementById('produtosContainer');
    const msgSemProdutos = document.getElementById('semProdutosMsg');
    if (container.children.length === 0) {
      msgSemProdutos.style.display = 'block';
    }
  });
}