document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formFornecedor');
    const salvarBtn = document.getElementById('salvarFornecedor');
    const cepInput = document.getElementById('cep');

    inicializarEventos();

    function inicializarEventos() {
        form.addEventListener('submit', onSalvarFornecedor);
        cepInput.addEventListener('blur', buscarEnderecoPorCEP);
    }


    function validarCamposObrigatorios() {
        const campos = [
            { id: 'razaoSocial', nome: 'Razão Social' },
            { id: 'nomeFantasia', nome: 'Nome Fantasia' },
            { id: 'cnpj', nome: 'CNPJ' },
            { id: 'cep', nome: 'CEP' },
            { id: 'endereco', nome: 'Endereço' },
            { id: 'bairro', nome: 'Bairro' },
            { id: 'numero', nome: 'Número' },
            { id: 'municipio', nome: 'Município' },
            { id: 'estado', nome: 'Estado' },
            { id: 'nomeContato', nome: 'Nome da Pessoa de Contato' },
            { id: 'telefone', nome: 'Telefone' },
            { id: 'email', nome: 'E-mail' }
        ];

        let mensagensErro = [];

        campos.forEach(campo => {
            const input = document.getElementById(campo.id);
            const valor = input.value.trim();

            if (!valor) {
                mensagensErro.push(`${campo.nome} é obrigatório.`);
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return mensagensErro;
    }


    function onSalvarFornecedor(e) {
        e.preventDefault();

        const erros = validarCamposObrigatorios();

        if (erros.length > 0) {
            alert(erros.join('\n'));
            return;
        }

        const dados = montarJSONFornecedor();
        console.log('JSON gerado:', JSON.stringify(dados, null, 2));

        alert('Fornecedor salvo com sucesso!');
       
    }

    function montarJSONFornecedor() {
        const fornecedor = {
            razaoSocial: getValor('razaoSocial'),
            nomeFantasia: getValor('nomeFantasia'),
            cnpj: getValor('cnpj'),
            inscEstadual: getValor('inscricaoEstadual'),
            inscMunicipal: getValor('inscricaoMunicipal'),
            endereco: getValor('endereco'),
            numero: getValor('numero'),
            complemento: getValor('complemento'),
            bairro: getValor('bairro'),
            municipio: getValor('municipio'),
            estado: getValor('estado'),
            contato: getValor('nomeContato'),
            telefone: getValor('telefone'),
            email: getValor('email')
        };

        const produtos = Array.from(document.querySelectorAll('.produto-container')).map(prod => ({
            descricao: prod.querySelector('.descricao').value,
            unidade: prod.querySelector('.unidade').value,
            quantidade: prod.querySelector('.quantidade').value,
            valorUnitario: prod.querySelector('.valorUnitario').value,
            valorTotal: prod.querySelector('.valorTotal').value
        }));

        const anexos = Array.from(document.querySelectorAll('.anexo-item')).map((item, index) => ({
            indice: index + 1,
            nomeArquivo: item.dataset.nome,
            blobArquivo: item.dataset.nome || ''
        }));

        return { fornecedor, produtos, anexos };
    }


    function buscarEnderecoPorCEP() {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado.');
                    return;
                }

                setValor('endereco', data.logradouro);
                setValor('bairro', data.bairro);
                setValor('municipio', data.localidade);
                setValor('estado', data.uf);
            })
            .catch(() => alert('Erro ao buscar CEP.'));
    }


    function getValor(id) {
        return document.getElementById(id)?.value.trim() || '';
    }

    function setValor(id, valor) {
        const input = document.getElementById(id);
        if (input) input.value = valor;
    }
});
