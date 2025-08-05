document.addEventListener('DOMContentLoaded', initAnexoModule);

let anexos = []; // Armazenamento em memória


function initAnexoModule() {
  const btnIncluir = document.getElementById('incluirAnexo');
  const btnConfirmar = document.getElementById('confirmarAnexo');
  const modal = new bootstrap.Modal(document.getElementById('anexoModal'));

  btnIncluir.addEventListener('click', () => abrirModal(modal));
  btnConfirmar.addEventListener('click', () => processarArquivo(modal));
  document.getElementById('visualizarAnexoModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('iframeVisualizacao').src = '';
  });

}


function abrirModal(modal) {
  document.getElementById('arquivoAnexo').value = '';
  modal.show();
}

function processarArquivo(modal) {
  const arquivoInput = document.getElementById('arquivoAnexo');
  const arquivo = arquivoInput.files[0];

  if (!arquivo) {
    alert('Selecione um arquivo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => criarAnexo(e.target.result, arquivo, modal);
  reader.readAsDataURL(arquivo);
}

function criarAnexo(base64, arquivo, modal) {
    const nome = arquivo.name;
    const extensao = nome.substring(nome.lastIndexOf('.'));
    const container = document.getElementById('anexosContainer');
    const msg = document.getElementById('semAnexosMsg');

    const div = document.createElement('div');
    div.classList.add('anexo-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2');
    div.dataset.nome = nome;
    div.dataset.blob = base64;

        div.innerHTML = `
    <div>
        <span><strong>${nome}</strong> (${extensao})</span>
    </div>
    <div class="d-flex gap-2">
    <button type="button" class="btn btn-primary btn-visualizar rounded-3 px-4 py-2 me-2" title="Visualizar">
        <i class="bi bi-eye fs-4 text-white"></i>
    </button>
    <button type="button" class="btn btn-outline-secondary btnDownloadAnexo flex-fill rounded-3 px-4 py-2" title="Download Anexo">
        <i class="bi bi-download"></i>
    </button>
    <button type="button" class="btn btn-danger btn-remover rounded-3 px-4 py-2" style="background-color: #dc3545; border-color: #dc3545;" title="Remover">
        <i class="bi bi-trash fs-4 text-white"></i>
    </button>
    </div>`;

    container.appendChild(div);
    msg.style.display = 'none';


    div.querySelector('.btn-remover').addEventListener('click', () => removerAnexo(div));

    div.querySelector('.btn-visualizar').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        visualizarAnexo(base64, nome);
    });

    anexos.push({ nome, blob: base64 });

    sessionStorage.setItem('anexos', JSON.stringify(anexos));

    div.querySelector('.btnDownloadAnexo').addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = nome;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.activeElement.blur();

    modal.hide();
}

function visualizarAnexo(base64, nome) {
    const iframe = document.getElementById('iframeVisualizacao');
    const modal = new bootstrap.Modal(document.getElementById('visualizarAnexoModal'));

    const extensoesVisualizaveis = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.txt', '.html', '.htm'];
    const extensao = nome.substring(nome.lastIndexOf('.')).toLowerCase();

    if (!extensoesVisualizaveis.includes(extensao)) {
        alert(`O arquivo "${nome}" não pode ser visualizado no navegador. Faça o download para abrir.`);
        return;
    }

    iframe.src = base64;
    document.getElementById('visualizarAnexoModalLabel').innerText = `Visualizando: ${nome}`;
    modal.show();
}


function removerAnexo(div) {
  const nome = div.dataset.nome;
  div.remove();


  anexos = anexos.filter(anexo => anexo.nome !== nome);

  // Atualiza o sessionStorage
  sessionStorage.setItem('anexos', JSON.stringify(anexos));

  // Atualiza mensagem
  const container = document.getElementById('anexosContainer');
  const msg = document.getElementById('semAnexosMsg');
  if (container.children.length === 0) {
    msg.style.display = 'block';
  }
}



