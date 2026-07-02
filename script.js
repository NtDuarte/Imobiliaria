// ─── DADOS ───────────────────────────────────────────
/**
 * ─── CADASTRO DOS IMÓVEIS ──────────────────────────
 *
 * Duarte, aqui está o coração dos anúncios do site.
 *
 * COMO FUNCIONA A PARTE DAS FOTOS:
 * 1. Deixe este arquivo index.html no mesmo nível da pasta img.
 *    Exemplo:
 *      index.html
 *      img/
 *        Casa em Itaipú/
 *        Apartamento Bom Pastor/
 *        Apartamento Copa/
 *        Apartamento Proximo Bauru/
 *        Casa em Nova Piam/
 *        Casa Nilopolis/
 *        Galpao Belford Roxo/
 *        Predio a venda/
 *        Apartamento Centro Bel/
 *
 *    Observação: o nome de cada pasta em disco precisa ser IDÊNTICO
 *    (acentos incluídos) ao valor de "pastaFotos" de cada imóvel logo abaixo.
 *
 * 2. Dentro de cada pasta, coloque as fotos em sequência:
 *      1.jpeg, 2.jpeg, 3.jpeg... até 30.jpeg
 *
 * 3. O site monta automaticamente os caminhos das imagens com base no nome da pasta.
 *    Exemplo: gerarImagensDaPasta("Apartamento Bom Pastor") cria:
 *      img/Apartamento Bom Pastor/1.jpeg
 *      img/Apartamento Bom Pastor/2.jpeg
 *      img/Apartamento Bom Pastor/3.jpeg
 *
 * Observação importante:
 * HTML/JavaScript puro não consegue listar sozinho os arquivos de uma pasta.
 * Por isso, usamos um padrão numérico fixo: 1.jpeg até 30.jpeg.
 */
const PASTA_BASE_FOTOS = 'img';
const TOTAL_FOTOS_POR_PASTA = 30;
const EXTENSOES_FOTOS = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG', 'webp', 'WEBP'];
const FOTO_FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=60';

function gerarCaminhoFoto(nomePasta, numero, extensao) {
    return `${PASTA_BASE_FOTOS}/${nomePasta}/${numero}.${extensao}`;
}

function testarImagem(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

async function encontrarFotoExistente(nomePasta, numero) {
    for (const extensao of EXTENSOES_FOTOS) {
        const src = gerarCaminhoFoto(nomePasta, numero, extensao);
        const encontrada = await testarImagem(src);
        if (encontrada) return encontrada;
    }
    return null;
}

// Otimização: para de tentar depois de 2 falhas seguidas, em vez de sempre
// testar os 30 números x 4 extensões (até 120 requisições por imóvel).
async function identificarFotosDaPasta(nomePasta, total = TOTAL_FOTOS_POR_PASTA) {
    const imagens = [];
    let falhasSeguidas = 0;
    const LIMITE_FALHAS_SEGUIDAS = 2;

    for (let numero = 1; numero <= total; numero++) {
        const foto = await encontrarFotoExistente(nomePasta, numero);
        if (foto) {
            imagens.push(foto);
            falhasSeguidas = 0;
        } else {
            falhasSeguidas++;
            if (falhasSeguidas >= LIMITE_FALHAS_SEGUIDAS) break;
        }
    }

    return imagens.length ? imagens : [FOTO_FALLBACK];
}

function gerarImagensDaPasta(nomePasta, total = TOTAL_FOTOS_POR_PASTA) {
    // Lista provisória para o HTML já ter referência inicial.
    // Ao carregar o site, identificarFotosDosImoveis() troca isso somente pelas fotos que existem de verdade.
    const imagens = [];
    for (let numero = 1; numero <= total; numero++) {
        imagens.push(gerarCaminhoFoto(nomePasta, numero, 'jpeg'));
    }
    return imagens;
}

async function identificarFotosDosImoveis() {
    await Promise.all(imoveis.map(async imovel => {
        if (!imovel.pastaFotos) return;
        imovel.imagens = await identificarFotosDaPasta(imovel.pastaFotos);
    }));
}

function montarLinkWhatsApp(titulo) {
    const mensagem = `Olá! Vi o anúncio no site e gostaria de mais detalhes sobre: ${titulo}.`;
    return `https://wa.me/5521964495359?text=${encodeURIComponent(mensagem)}`;
}

const mapaPadraoBelfordRoxo = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14716.4153214572!2d-43.39991725!3d-22.76088745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9965126!2sBelford+Roxo+RJ!5e0!3m2!1spt-BR!2sbr";

const imoveis = [
     {
        id: 1,
        tipo: "casa",
        bairro: "Itaipú",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Casa em Itaipú",
        preco: 235000,
        precoFormatado: "R$ 235.000",
        quartos: 3,
        banheiros: 2,
        area: 300,
        vagas: 2,
        novo: false,
        descricao: "Casa de três quartos, sala, cozinha e banheiro, área de serviços e um amplo quintal. Lote de terreno com 300m2 Av. Suburbana, Bairro Itaipú, Belgord Roxo/RJ.IMÓVEL COM ESCRITURA REGISTRADA.",
        pastaFotos: "Casa em Itaipú",
        imagens: gerarImagensDaPasta("Casa em Itaipú"),
        linkZap: montarLinkWhatsApp("Casa em Itaipú"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 2,
        tipo: "apartamento",
        bairro: "Bom Pastor",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Apartamento em Bom Pastor",
        preco: 170000,
        precoFormatado: "R$ 170.000",
        quartos: 2,
        banheiros: 1,
        area: 0,
        vagas: 1,
        novo: true,
        descricao: ". ExEstrada Belford Roxo, número 907, Bloco 01 - B13, apartamento 3, (primeiro andar), Apartamento de dois quartos, sala, cozinha e banheiro.celente oportunidade para quem busca praticidade, boa localização e atendimento seguro para compra.",
        pastaFotos: "Apartamento Bom Pastor",
        imagens: gerarImagensDaPasta("Apartamento Bom Pastor"),
        linkZap: montarLinkWhatsApp("Apartamento Bom Pastor"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 3,
        tipo: "apartamento",
        bairro: "Copacabana",
        cidade: "Rio de Janeiro",
        finalidade: "venda",
        titulo: "Apartamento em Copacabana",
        preco: 7200000,
        precoFormatado: "R$ 7.200.000",
        quartos: 6,
        banheiros: 4,
        area: 400,
        vagas: 1,
        novo: false,
        descricao: "O apto de Copa, na Atlântica, tem 400m², 6 qtos mas só 1 vaga na garagem apesar de ter um contrato em vigor de mais uma vaga alugada de terceiros. Ideal para famílias que desejam morar com conforto e fácil acesso aos principais pontos da cidade.",
        pastaFotos: "Apartamento Copa",
        imagens: gerarImagensDaPasta("Apartamento Copa"),
        linkZap: montarLinkWhatsApp("Apartamento Copa"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 4,
        tipo: "apartamento",
        bairro: "Vila Vitório",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Apartamento em Belford ",
        preco: 300000,
        precoFormatado: "R$ 300.000",
        quartos: 2,
        banheiros: 1,
        area: 0,
        vagas: 0,
        novo: false,
        descricao: "Vendo dois apartamentos, cada um de 2 quartos, sala, cozinha e banheiro. (Próximo ao Restaurante Bauru, em Belford Roxo). Com localização estratégica e ótimo potencial para moradia ou investimento.",
        pastaFotos: "Apartamento Proximo Bauru",
        imagens: gerarImagensDaPasta("Apartamento Proximo Bauru"),
        linkZap: montarLinkWhatsApp("Apartamento Próximo Bauru"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 5,
        tipo: "casa",
        bairro: "Nova Piam",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Casa em Nova Piam",
        preco: 430000,
        precoFormatado: "R$ 430.000",
        quartos: 3,
        banheiros: 2,
        area: 0,
        vagas: 1,
        novo: true,
        descricao: "Vendo casa em Nova Piam - próxima a Vila Olímpica - 2 quartos, uma suíte, sala, cozinha, banheiro, área de serviços, área gourmet, piscina, terraço e garagem, ótima opção para quem busca um imóvel residencial em bairro tradicional da região.",
        pastaFotos: "Casa em Nova Piam",
        imagens: gerarImagensDaPasta("Casa em Nova Piam"),
        linkZap: montarLinkWhatsApp("Casa em Nova Piam"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 6,
        tipo: "casa",
        bairro: "Nilópolis",
        cidade: "Nilópolis",
        finalidade: "venda",
        titulo: "Casa em Nilópolis",
        preco: 300000,
        precoFormatado: "R$ 300.000",
        quartos: 2,
        banheiros: 1,
        area: 0,
        vagas: 1,
        novo: false,
        descricao: "Vendo casa (sobrado), em Nilópolis de 2 quartos, sala, cozinha e banheiro, garagem. (Com escritura) indicada para quem procura uma oportunidade residencial na Baixada Fluminense.",
        pastaFotos: "Casa Nilopolis",
        imagens: gerarImagensDaPasta("Casa Nilopolis"),
        linkZap: montarLinkWhatsApp("Casa Nilópolis"),
        mapaLink: mapaPadraoBelfordRoxo
    },
     {
        id: 7,
        tipo: "comercial",
        bairro: "Centro",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Galpão Centro",
        preco: 1100000,
        precoFormatado: "R$ 1.100.000",
        quartos: 0,
        banheiros: 1,
        area: 260,
        vagas: 0,
        novo: false,
        descricao: "Vendo Galpão no Centro de Belford Roxo/RJ, com 260m2.",
        pastaFotos: "Galpao Belford Roxo",
        imagens: gerarImagensDaPasta("Galpao Belford Roxo"),
        linkZap: montarLinkWhatsApp("Galpao Belford Roxo"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 8,
        tipo: "apartamento",
        bairro: "Centro",
        cidade: "Belford Roxo",
        finalidade: "locacao",
        titulo: "Apartamento Centro",
        preco: 1500,
        precoFormatado: "R$ 1.500",
        quartos: 3,
        banheiros: 2,
        area: 0,
        vagas: 2,
        novo: false,
        descricao: "Alugo apartamento no Centro de Belford Roxo, próximo ao Macdonald, Farmácia, ponto de ônibus, comércio variado, tudo para facilitar a vida do interessado, Três quartos, sendo um suíte, sala, cozinha, banheiro social, área de serviço interna e uma ampla área externa, cobertura. (Câmera de vídeo, interfone, duas entradas para acesso ao imóvel) paga água, luz e IPTU.",
        pastaFotos: "Apartamento Centro",
        imagens: gerarImagensDaPasta("Apartamento Centro"),
        linkZap: montarLinkWhatsApp("Apartamento Centro"),
        mapaLink: mapaPadraoBelfordRoxo
    },
    {
        id: 9,
        tipo: "apartamento",
        bairro: "Santa Maria",
        cidade: "Belford Roxo",
        finalidade: "venda",
        titulo: "Prédio à Venda",
        preco: 450000,
        precoFormatado: "R$ 450.000",
        quartos: 1,
        banheiros: 1,
        area: 0,
        vagas: 0,
        novo: false,
        descricao: "Vendo prédio com seis apartamentos (dois por andar, no ponto para acabamento), na Rua Breno de Souza Alves, Santa Maria, Belford Roxo, cada um de 1 quarto, sala, cozinha e banheiro. (Com escritura).",
        pastaFotos: "Predio a venda",
        imagens: gerarImagensDaPasta("Predio a venda"),
        linkZap: montarLinkWhatsApp("Prédio à Venda"),
        mapaLink: mapaPadraoBelfordRoxo
    },
];


// Normaliza os valores dos imóveis para exibir corretamente no card e no modal.
// Importante: no JavaScript, use números sem ponto de milhar. Ex: 170000, não 170.000.
function formatarPrecoImovel(valor, valorFormatado) {
    if (valorFormatado && valorFormatado !== 'Consulte') return valorFormatado;
    const numero = Number(valor);
    if (!numero || Number.isNaN(numero)) return 'Consulte';
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

imoveis.forEach(imovel => {
    imovel.precoFormatado = formatarPrecoImovel(imovel.preco, imovel.precoFormatado);
});

// ─── STATE ───────────────────────────────────────────
let filtroAtivo = 'todos';
let tabAtiva = 'todos';
let favoritos = JSON.parse(localStorage.getItem('jc_favoritos') || '[]');
let cardSlideTimers = [];
let modalSlideTimer = null;
let modalImovelAtual = null;
let modalFotoAtual = 0;

// ─── FORM STATE ──────────────────────────────────────
let etapaAtual = 1;
const totalEtapas = 5;
let finalidadeSelecionada = 'venda';
let fotosAnuncio = [];

// Tipos de imóvel para os quais os campos de quartos/banheiros não fazem sentido
const TIPOS_SEM_COMODOS = ['Terreno / Lote', 'Galpão / Armazém'];

const amenidadesLista = [
    { icon: 'fa-swimming-pool', label: 'Piscina' },
    { icon: 'fa-fire', label: 'Churrasqueira' },
    { icon: 'fa-shield-alt', label: 'Portão Eletrônico' },
    { icon: 'fa-solar-panel', label: 'Energia Solar' },
    { icon: 'fa-tint', label: 'Poço Artesiano' },
    { icon: 'fa-dog', label: 'Aceita Pets' },
    { icon: 'fa-couch', label: 'Mobiliado' },
    { icon: 'fa-snowflake', label: 'Ar Condicionado' },
    { icon: 'fa-wifi', label: 'Fibra Óptica' },
    { icon: 'fa-warehouse', label: 'Depósito / Edícula' },
    { icon: 'fa-tree', label: 'Quintal / Jardim' },
    { icon: 'fa-camera', label: 'Câmeras de Segurança' },
];

// ─── RENDER CARDS ────────────────────────────────────
function limparSlidesCards() {
    cardSlideTimers.forEach(timer => clearInterval(timer));
    cardSlideTimers = [];
}

function renderCards(lista) {
    limparSlidesCards();
    const container = document.getElementById('lista-imoveis');
    if (lista.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-home"></i><h3 style="color:var(--navy);margin-bottom:8px">Nenhum imóvel encontrado</h3><p>Tente outros filtros ou entre em contato pelo WhatsApp.</p><a href="https://wa.me/5521964495359" target="_blank" class="btn-primary" style="display:inline-flex;margin-top:20px"><i class="fab fa-whatsapp"></i> Falar com Corretor</a></div>`;
        return;
    }
    container.innerHTML = lista.map(im => {
        const isFav = favoritos.includes(im.id);
        const imgSrc = im.imagens[0];
        const temGaleria = im.imagens && im.imagens.length > 1;
        const badgeFinalidade = im.finalidade === 'venda' ? `<span class="badge badge-venda">Venda</span>` : `<span class="badge badge-locacao">Locação</span>`;
        const badgeNovo = im.novo ? `<span class="badge badge-novo">Novo</span>` : '';
        return `
        <div class="card" onclick="abrirModal(${im.id})">
            <div class="card-img-wrapper">
                <img src="${imgSrc}" alt="${im.titulo}" class="foto-imovel" id="card-img-${im.id}" data-index="0" onerror="this.src=FOTO_FALLBACK">
                ${temGaleria ? `
                    <button class="card-gallery-btn prev" onclick="trocarFotoCard(event, ${im.id}, -1)" title="Foto anterior"><i class="fas fa-chevron-left"></i></button>
                    <button class="card-gallery-btn next" onclick="trocarFotoCard(event, ${im.id}, 1)" title="Próxima foto"><i class="fas fa-chevron-right"></i></button>
                    <div class="card-gallery-counter" id="card-counter-${im.id}">1/${im.imagens.length}</div>
                ` : ''}
                <div class="card-badges"><span class="badge badge-tipo">${im.tipo}</span>${badgeFinalidade}${badgeNovo}</div>
                <button class="card-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${im.id})" title="${isFav ? 'Remover dos favoritos' : 'Favoritar'}">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <div class="card-title">${im.titulo}</div>
                <div class="card-location"><i class="fas fa-map-marker-alt"></i>${im.bairro}, ${im.cidade}</div>
                <div class="card-features">
                    <span class="card-feature"><i class="fas fa-bed"></i> ${im.quartos} quartos</span>
                    <span class="card-feature"><i class="fas fa-bath"></i> ${im.banheiros} banheiro${im.banheiros>1?'s':''}</span>
                    <span class="card-feature"><i class="fas fa-ruler-combined"></i> ${im.area}m²</span>
                    ${im.vagas ? `<span class="card-feature"><i class="fas fa-car"></i> ${im.vagas} vaga${im.vagas>1?'s':''}</span>` : ''}
                </div>
                <div class="card-footer">
                    <div class="card-price"><small>${im.finalidade === 'locacao' ? 'Aluguel' : 'Valor'}</small>${im.precoFormatado}</div>
                    <a href="${im.linkZap}" target="_blank" class="btn-card-zap" onclick="event.stopPropagation()"><i class="fab fa-whatsapp"></i> Contato</a>
                </div>
            </div>
        </div>`;
    }).join('');
    iniciarSlidesCards(lista);
}

function iniciarSlidesCards(lista) {
    lista.forEach(im => {
        if (!im.imagens || im.imagens.length <= 1) return;
        const timer = setInterval(() => trocarFotoCard(null, im.id, 1), 10000);
        cardSlideTimers.push(timer);
    });
}

function trocarFotoCard(event, id, direcao) {
    if (event) event.stopPropagation();
    const im = imoveis.find(i => i.id === id);
    const img = document.getElementById(`card-img-${id}`);
    const counter = document.getElementById(`card-counter-${id}`);
    if (!im || !img || !im.imagens || im.imagens.length <= 1) return;

    const atual = Number(img.dataset.index || 0);
    const novo = (atual + direcao + im.imagens.length) % im.imagens.length;
    img.dataset.index = novo;
    img.src = im.imagens[novo];
    if (counter) counter.textContent = `${novo + 1}/${im.imagens.length}`;
}

async function carregarImoveis() {
    const container = document.getElementById('lista-imoveis');
    if (container) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3 style="color:var(--navy);margin-bottom:8px">Carregando fotos dos imóveis...</h3><p>Validando automaticamente as imagens disponíveis nas pastas.</p></div>`;
    }

    await identificarFotosDosImoveis();
    renderCards(imoveis);
    renderAmenidades();
}

// ─── FILTROS ─────────────────────────────────────────
function filtrar() {
    const tipo = document.getElementById('filtro-tipo').value;
    const bairro = document.getElementById('busca-bairro').value.trim().toLowerCase();
    const precoMax = document.getElementById('filtro-preco').value;
    const quartos = document.getElementById('filtro-quartos').value;
    let resultado = imoveis.filter(im => {
        if (tipo !== 'todos' && im.tipo !== tipo) return false;
        if (bairro && !im.bairro.toLowerCase().includes(bairro) && !im.cidade.toLowerCase().includes(bairro)) return false;
        if (precoMax && im.preco > parseInt(precoMax)) return false;
        if (quartos && im.quartos < parseInt(quartos)) return false;
        if (tabAtiva === 'comprar' && im.finalidade !== 'venda') return false;
        if (tabAtiva === 'alugar' && im.finalidade !== 'locacao') return false;
        return true;
    });
    renderCards(resultado);
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (resultado.length > 0) showToast(`${resultado.length} imóvel${resultado.length > 1 ? 'is' : ''} encontrado${resultado.length > 1 ? 's' : ''}`);
    else showToast('Nenhum resultado. Tente outros filtros.');
}

function setFilter(tipo, btn) {
    filtroAtivo = tipo;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    let resultado = tipo === 'todos' ? imoveis : imoveis.filter(im => im.tipo === tipo || im.finalidade === tipo);
    renderCards(resultado);
}

function setTab(btn, tab) {
    tabAtiva = tab;
    document.querySelectorAll('.search-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setView(mode, btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const lista = document.getElementById('lista-imoveis');
    lista.className = mode === 'list' ? 'list-view' : '';
}

// ─── FAVORITOS ───────────────────────────────────────
function toggleFav(event, id) {
    event.stopPropagation();
    const idx = favoritos.indexOf(id);
    if (idx === -1) { favoritos.push(id); showToast('❤ Adicionado aos favoritos!'); }
    else { favoritos.splice(idx, 1); showToast('Removido dos favoritos'); }
    localStorage.setItem('jc_favoritos', JSON.stringify(favoritos));
    const btn = event.currentTarget;
    btn.classList.toggle('active', favoritos.includes(id));
    btn.querySelector('i').className = favoritos.includes(id) ? 'fas fa-heart' : 'far fa-heart';
}

// ─── MODAL ───────────────────────────────────────────
function abrirModal(id) {
    const im = imoveis.find(i => i.id === id);
    if (!im) return;

    modalImovelAtual = im;
    modalFotoAtual = 0;
    clearInterval(modalSlideTimer);

    const thumbsHTML = im.imagens.map((src, i) =>
        `<img src="${src}" class="modal-thumb ${i === 0 ? 'active' : ''}" onerror="this.style.display='none'" onclick="trocarFotoModal(${i})" alt="Foto ${i+1}">`
    ).join('');

    document.getElementById('modal-body').innerHTML = `
        <div class="modal-gallery">
            <img src="${im.imagens[0]}" alt="${im.titulo}" class="modal-main-img" id="modal-main-img" onerror="this.src=FOTO_FALLBACK">
            ${im.imagens.length > 1 ? `
                <button class="modal-gallery-btn prev" onclick="navegarFotoModal(event, -1)" title="Foto anterior"><i class="fas fa-chevron-left"></i></button>
                <button class="modal-gallery-btn next" onclick="navegarFotoModal(event, 1)" title="Próxima foto"><i class="fas fa-chevron-right"></i></button>
                <div class="modal-gallery-counter" id="modal-gallery-counter">1/${im.imagens.length}</div>
                <div class="modal-thumbs">${thumbsHTML}</div>
            ` : ''}
        </div>
        <div class="modal-body">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title">${im.titulo}</h2>
                    <div class="modal-location"><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i>${im.bairro}, ${im.cidade} – RJ</div>
                </div>
                <div class="modal-price">
                    <div class="modal-price-label">${im.finalidade === 'locacao' ? 'Aluguel' : 'Valor de venda'}</div>
                    <div class="modal-price-value">${im.precoFormatado}</div>
                </div>
            </div>
            <div class="modal-features">
                <div class="modal-feature"><i class="fas fa-bed"></i> ${im.quartos} Quartos</div>
                <div class="modal-feature"><i class="fas fa-bath"></i> ${im.banheiros} Banheiro${im.banheiros>1?'s':''}</div>
                <div class="modal-feature"><i class="fas fa-ruler-combined"></i> ${im.area}m²</div>
                ${im.vagas ? `<div class="modal-feature"><i class="fas fa-car"></i> ${im.vagas} Vaga${im.vagas>1?'s':''}</div>` : ''}
                <div class="modal-feature"><i class="fas fa-tag"></i> ${im.finalidade === 'venda' ? 'Venda' : 'Locação'}</div>
            </div>
            <div class="modal-desc"><h4>Sobre o imóvel</h4><p>${im.descricao}</p></div>
            <div class="modal-map"><h4>Localização aproximada</h4><iframe src="${im.mapaLink}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
            <div class="modal-actions">
                <a href="${im.linkZap}" target="_blank" class="btn-zap-modal"><i class="fab fa-whatsapp" style="font-size:1.2rem"></i>Agendar Visita pelo WhatsApp</a>
                <button class="btn-share" onclick="compartilhar('${im.titulo}')"><i class="fas fa-share-alt"></i> Compartilhar</button>
                <button class="btn-share" onclick="toggleFavModal(${im.id})" id="fav-modal-btn-${im.id}">
                    <i class="${favoritos.includes(im.id) ? 'fas' : 'far'} fa-heart" style="color:${favoritos.includes(im.id)?'#e74c3c':'inherit'}"></i>
                    ${favoritos.includes(im.id) ? 'Salvo' : 'Salvar'}
                </button>
            </div>
        </div>`;
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';

    if (im.imagens.length > 1) {
        modalSlideTimer = setInterval(() => navegarFotoModal(null, 1), 10000);
    }
}

function fecharModal() {
    clearInterval(modalSlideTimer);
    modalSlideTimer = null;
    modalImovelAtual = null;
    modalFotoAtual = 0;
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = 'auto';
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('modal-overlay')) fecharModal();
}

function navegarFotoModal(event, direcao) {
    if (event) event.stopPropagation();
    if (!modalImovelAtual || !modalImovelAtual.imagens || modalImovelAtual.imagens.length <= 1) return;
    const novoIndex = (modalFotoAtual + direcao + modalImovelAtual.imagens.length) % modalImovelAtual.imagens.length;
    trocarFotoModal(novoIndex);
}

function trocarFotoModal(index) {
    if (!modalImovelAtual || !modalImovelAtual.imagens[index]) return;
    modalFotoAtual = index;
    document.getElementById('modal-main-img').src = modalImovelAtual.imagens[index];
    const counter = document.getElementById('modal-gallery-counter');
    if (counter) counter.textContent = `${index + 1}/${modalImovelAtual.imagens.length}`;
    document.querySelectorAll('.modal-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
}

function trocarFoto(thumb, src) {
    document.getElementById('modal-main-img').src = src;
    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function toggleFavModal(id) {
    const mockEvent = { currentTarget: document.getElementById('fav-modal-btn-' + id), stopPropagation: () => {} };
    toggleFav(mockEvent, id);
    const btn = document.getElementById('fav-modal-btn-' + id);
    if (btn) btn.innerHTML = `<i class="${favoritos.includes(id) ? 'fas' : 'far'} fa-heart" style="color:${favoritos.includes(id)?'#e74c3c':'inherit'}"></i> ${favoritos.includes(id) ? 'Salvo' : 'Salvar'}`;
}

function compartilhar(titulo) {
    if (navigator.share) navigator.share({ title: titulo, text: `Veja este imóvel: ${titulo}`, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href).then(() => showToast('Link copiado!'));
}

// ─── ANUNCIAR: AMENIDADES ────────────────────────────
function renderAmenidades() {
    const grid = document.getElementById('amenidades-grid');
    if (!grid) return;
    grid.innerHTML = amenidadesLista.map((a, i) => `
        <label class="amenidade-item" id="am-label-${i}" onclick="toggleAmenidade(${i})">
            <input type="checkbox" id="am-${i}">
            <i class="fas ${a.icon}"></i>
            ${a.label}
        </label>
    `).join('');
}

function toggleAmenidade(i) {
    const label = document.getElementById(`am-label-${i}`);
    const cb = document.getElementById(`am-${i}`);
    cb.checked = !cb.checked;
    label.classList.toggle('checked', cb.checked);
}

function getAmenidadesSelecionadas() {
    return amenidadesLista
        .filter((_, i) => document.getElementById(`am-${i}`) && document.getElementById(`am-${i}`).checked)
        .map(a => a.label);
}

// ─── ANUNCIAR: FINALIDADE ────────────────────────────
function selecionarFinalidade(tipo) {
    finalidadeSelecionada = tipo;
    document.getElementById('btn-venda').classList.toggle('active', tipo === 'venda');
    document.getElementById('btn-locacao').classList.toggle('active', tipo === 'locacao');
}

// ─── ANUNCIAR: CAMPOS CONDICIONAIS (Quartos/Banheiros) ────────
function atualizarCamposCondicionais() {
    const tipo = document.getElementById('an-tipo').value;
    const esconder = TIPOS_SEM_COMODOS.includes(tipo);
    const grupoQuartos = document.getElementById('grupo-quartos');
    const grupoBanheiros = document.getElementById('grupo-banheiros');
    if (grupoQuartos) grupoQuartos.classList.toggle('visivel', !esconder);
    if (grupoBanheiros) grupoBanheiros.classList.toggle('visivel', !esconder);
}

// ─── ANUNCIAR: FOTOS ─────────────────────────────────
function adicionarFotos(event) {
    const files = Array.from(event.target.files);
    const disponivel = 20 - fotosAnuncio.length;
    const adicionadas = files.slice(0, disponivel);

    adicionadas.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotosAnuncio.push({ name: file.name, dataUrl: e.target.result });
            renderFotoPreviews();
        };
        reader.readAsDataURL(file);
    });

    if (files.length > disponivel) showToast(`Máximo de 20 fotos. ${files.length - disponivel} foto(s) ignorada(s).`);
    event.target.value = '';
}

function renderFotoPreviews() {
    const container = document.getElementById('foto-previews');
    const counter = document.getElementById('fotos-counter');
    const countEl = document.getElementById('fotos-count');

    container.innerHTML = fotosAnuncio.map((f, i) => `
        <div class="foto-preview-item">
            <img src="${f.dataUrl}" alt="Foto ${i+1}">
            <button class="foto-remove" onclick="removerFoto(${i})"><i class="fas fa-times"></i></button>
            ${i === 0 ? '<div class="foto-principal-badge"><i class="fas fa-star"></i> Capa</div>' : ''}
        </div>
    `).join('');

    counter.style.display = fotosAnuncio.length > 0 ? 'block' : 'none';
    countEl.textContent = fotosAnuncio.length;
}

function removerFoto(idx) {
    fotosAnuncio.splice(idx, 1);
    renderFotoPreviews();
}

// ─── DRAG AND DROP ───────────────────────────────────
const uploadZone = document.getElementById('upload-zone');
if (uploadZone) {
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } };
        adicionarFotos(fakeEvent);
    });
}

// ─── FORMATAÇÃO ──────────────────────────────────────
function formatarValor(input) {
    let v = input.value.replace(/\D/g, '');
    if (v) {
        v = parseInt(v).toLocaleString('pt-BR');
        input.value = v;
    }
}

function formatarTel(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    input.value = v.trim().replace(/-$/, '');
}

// ─── FORM NAVIGATION ─────────────────────────────────
function avancarEtapa() {
    if (!validarEtapa(etapaAtual)) return;

    if (etapaAtual === 4) {
        gerarReview();
    }

    document.getElementById(`page-${etapaAtual}`).classList.remove('active');
    document.getElementById(`step-${etapaAtual}`).classList.remove('active');
    document.getElementById(`step-${etapaAtual}`).classList.add('done');

    etapaAtual++;

    document.getElementById(`page-${etapaAtual}`).classList.add('active');
    document.getElementById(`step-${etapaAtual}`).classList.add('active');

    document.getElementById('btn-voltar').disabled = etapaAtual === 1;

    if (etapaAtual === totalEtapas) {
        document.getElementById('btn-avancar').style.display = 'none';
        document.getElementById('btn-enviar').style.display = 'flex';
    }

    document.getElementById('anunciar').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function voltarEtapa() {
    if (etapaAtual === 1) return;

    document.getElementById(`page-${etapaAtual}`).classList.remove('active');
    document.getElementById(`step-${etapaAtual}`).classList.remove('active');

    etapaAtual--;

    document.getElementById(`page-${etapaAtual}`).classList.add('active');
    document.getElementById(`step-${etapaAtual}`).classList.add('active');
    document.getElementById(`step-${etapaAtual}`).classList.remove('done');

    document.getElementById('btn-voltar').disabled = etapaAtual === 1;
    document.getElementById('btn-avancar').style.display = 'flex';
    document.getElementById('btn-enviar').style.display = 'none';
}

function validarEtapa(etapa) {
    if (etapa === 1) {
        const tipo = document.getElementById('an-tipo').value;
        if (!tipo) { showToast('⚠ Selecione o tipo do imóvel'); return false; }
    }
    if (etapa === 2) {
        const endereco = document.getElementById('an-endereco').value.trim();
        const bairro = document.getElementById('an-bairro').value.trim();
        const valor = document.getElementById('an-valor').value.trim();
        if (!endereco) { showToast('⚠ Informe o endereço do imóvel'); return false; }
        if (!bairro) { showToast('⚠ Informe o bairro'); return false; }
        if (!valor) { showToast('⚠ Informe o valor pretendido'); return false; }
    }
    if (etapa === 3) {
        if (fotosAnuncio.length === 0) { showToast('⚠ Adicione pelo menos 1 foto do imóvel'); return false; }
    }
    if (etapa === 4) {
        const nome = document.getElementById('an-nome').value.trim();
        const whatsapp = document.getElementById('an-whatsapp').value.trim();
        if (!nome) { showToast('⚠ Informe seu nome'); return false; }
        if (!whatsapp || whatsapp.replace(/\D/g,'').length < 10) { showToast('⚠ Informe um WhatsApp válido'); return false; }
    }
    return true;
}

function gerarReview() {
    const tipo = document.getElementById('an-tipo').value;
    const endereco = document.getElementById('an-endereco').value;
    const bairro = document.getElementById('an-bairro').value;
    const cidade = document.getElementById('an-cidade').value;
    const valor = document.getElementById('an-valor').value;
    const quartos = document.getElementById('an-quartos').value || '—';
    const banheiros = document.getElementById('an-banheiros').value || '—';
    const vagas = document.getElementById('an-vagas').value || '—';
    const area = document.getElementById('an-area').value || '—';
    const descricao = document.getElementById('an-descricao').value || '—';
    const nome = document.getElementById('an-nome').value;
    const whatsapp = document.getElementById('an-whatsapp').value;
    const email = document.getElementById('an-email').value || '—';
    const horario = document.getElementById('an-horario').value;
    const amenidades = getAmenidadesSelecionadas();

    const fotosHtml = fotosAnuncio.slice(0, 6).map((f, i) =>
        `<img src="${f.dataUrl}" class="review-foto" alt="Foto ${i+1}">`
    ).join('') + (fotosAnuncio.length > 6 ? `<div style="display:flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--gray-light);border-radius:8px;font-size:0.8rem;font-weight:700;color:var(--gray-text)">+${fotosAnuncio.length - 6}</div>` : '');

    document.getElementById('review-content').innerHTML = `
        <div class="review-card">
            <div class="review-card-title"><i class="fas fa-tag"></i> Finalidade & Tipo</div>
            <div class="review-grid">
                <div class="review-item"><div class="review-item-label">Finalidade</div><div class="review-item-value">${finalidadeSelecionada === 'venda' ? '🏠 Venda' : '🔑 Locação'}</div></div>
                <div class="review-item"><div class="review-item-label">Tipo</div><div class="review-item-value">${tipo}</div></div>
            </div>
        </div>
        <div class="review-card">
            <div class="review-card-title"><i class="fas fa-map-marker-alt"></i> Localização & Valor</div>
            <div class="review-grid">
                <div class="review-item"><div class="review-item-label">Endereço</div><div class="review-item-value">${endereco}</div></div>
                <div class="review-item"><div class="review-item-label">Bairro / Cidade</div><div class="review-item-value">${bairro}, ${cidade}</div></div>
                <div class="review-item"><div class="review-item-label">Valor</div><div class="review-item-value" style="color:var(--gold)">R$ ${valor}</div></div>
            </div>
        </div>
        <div class="review-card">
            <div class="review-card-title"><i class="fas fa-home"></i> Características</div>
            <div class="review-grid">
                <div class="review-item"><div class="review-item-label">Quartos</div><div class="review-item-value">${quartos}</div></div>
                <div class="review-item"><div class="review-item-label">Banheiros</div><div class="review-item-value">${banheiros}</div></div>
                <div class="review-item"><div class="review-item-label">Vagas</div><div class="review-item-value">${vagas}</div></div>
                <div class="review-item"><div class="review-item-label">Área (m²)</div><div class="review-item-value">${area}</div></div>
            </div>
            ${amenidades.length > 0 ? `<div style="margin-top:12px;font-size:0.82rem;color:var(--gray-text)">${amenidades.map(a => `<span style="display:inline-block;background:rgba(232,169,32,0.12);border:1px solid rgba(232,169,32,0.3);color:var(--navy);padding:3px 10px;border-radius:50px;margin:3px;font-size:0.75rem;font-weight:600">${a}</span>`).join('')}</div>` : ''}
        </div>
        <div class="review-card">
            <div class="review-card-title"><i class="fas fa-camera"></i> Fotos (${fotosAnuncio.length})</div>
            <div class="review-fotos-strip">${fotosHtml}</div>
        </div>
        <div class="review-card">
            <div class="review-card-title"><i class="fas fa-user"></i> Seus dados</div>
            <div class="review-grid">
                <div class="review-item"><div class="review-item-label">Nome</div><div class="review-item-value">${nome}</div></div>
                <div class="review-item"><div class="review-item-label">WhatsApp</div><div class="review-item-value">${whatsapp}</div></div>
                <div class="review-item"><div class="review-item-label">E-mail</div><div class="review-item-value">${email}</div></div>
                <div class="review-item"><div class="review-item-label">Melhor horário</div><div class="review-item-value">${horario}</div></div>
            </div>
        </div>
    `;
}

function enviarAnuncio() {
    const tipo = document.getElementById('an-tipo').value;
    const endereco = document.getElementById('an-endereco').value;
    const bairro = document.getElementById('an-bairro').value;
    const cidade = document.getElementById('an-cidade').value;
    const valor = document.getElementById('an-valor').value;
    const quartos = document.getElementById('an-quartos').value || 'Não informado';
    const banheiros = document.getElementById('an-banheiros').value || 'Não informado';
    const vagas = document.getElementById('an-vagas').value || 'Não informado';
    const area = document.getElementById('an-area').value || 'Não informado';
    const descricao = document.getElementById('an-descricao').value || 'Não informado';
    const nome = document.getElementById('an-nome').value;
    const whatsapp = document.getElementById('an-whatsapp').value;
    const email = document.getElementById('an-email').value || 'Não informado';
    const horario = document.getElementById('an-horario').value;
    const amenidades = getAmenidadesSelecionadas();

    const finalidade = finalidadeSelecionada === 'venda' ? 'VENDA' : 'LOCAÇÃO';

    const mensagem = `*NOVO ANÚNCIO — JC Nascimento Imóveis*

*Finalidade:* ${finalidade}
*Tipo:* ${tipo}

*📍 Localização*
Endereço: ${endereco}
Bairro: ${bairro} | Cidade: ${cidade}

*💰 Valor pretendido:* R$ ${valor}

*🏠 Características*
Quartos: ${quartos}
Banheiros: ${banheiros}
Vagas de garagem: ${vagas}
Área: ${area}m²

*✨ Amenidades:* ${amenidades.length > 0 ? amenidades.join(', ') : 'Nenhuma selecionada'}

*📝 Descrição:*
${descricao}

*📷 Fotos:* ${fotosAnuncio.length} foto(s) disponível(is) — enviarei pelo chat

*👤 Dados do proprietário*
Nome: ${nome}
WhatsApp: ${whatsapp}
E-mail: ${email}
Melhor horário: ${horario}`;

    const url = `https://wa.me/5521964495359?text=${encodeURIComponent(mensagem)}`;

    // Mostrar sucesso
    document.getElementById(`page-${etapaAtual}`).classList.remove('active');
    document.getElementById(`step-${etapaAtual}`).classList.remove('active');
    document.getElementById(`step-${etapaAtual}`).classList.add('done');
    document.getElementById('form-sucesso').classList.add('ativo');
    document.getElementById('form-nav').style.display = 'none';

    window.open(url, '_blank');
}

// ─── TOAST ───────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── HEADER SCROLL ───────────────────────────────────
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.getElementById('site-header').classList.toggle('scrolled', scrolled > 60);
    document.getElementById('back-top').classList.toggle('visible', scrolled > 400);
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progress-bar').style.width = ((scrolled / total) * 100) + '%';
});

// ─── MOBILE NAV ──────────────────────────────────────
function toggleMobileNav() {
    document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileNav() {
    document.getElementById('mobile-nav').classList.remove('open');
}

// ─── KEYBOARD ────────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
});

// ─── INIT ─────────────────────────────────────────────
window.onload = carregarImoveis;
