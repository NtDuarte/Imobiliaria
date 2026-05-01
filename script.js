// Banco de dados dos imóveis
const imoveis = [
    {
        id: 0,
        tipo: "apartamento",
        bairro: "Centro",
        finalidade: "Venda",
        titulo: "Apartamento Moderno - Centro",
        preco: "R$ 320.000",
        detalhes: "2 Quartos | 1 Banheiro | 60m² | Próximo ao comércio local e estação de trem.",
        imagens: ["img/ap1-1.jpg", "img/ap1-2.jpg", "img/ap1-3.jpg"], 
        linkZap: "https://wa.me/5521964495359?text=Vi%20o%20Apartamento%20Centro",
        // Exemplo de link embed do Google Maps (Centro do Rio)
        mapaLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.296047628409!2d-43.17686008448741!3d-22.90583394342998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f5e8f32c5b9%3A0x707503074730770!2sAv.%20Rio%20Branco%20-%20Centro%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1677600000000!5m2!1spt-BR!2sbr"
    },
    {
        id: 1,
        tipo: "casa",
        bairro: "Heliópolis",
        finalidade: "Venda",
        titulo: "Casa Lazer Completo",
        preco: "R$ 260.000",
        detalhes: "2 Quartos | 2 Banheiros | Sala ampla | Cozinha americana | Piscina de 15 mil litros | Área Gourmet com churrasqueira | Varanda arejada | Garagem para 2 carros.",
        imagens: ["img/casa-lazer-1.jpg", "img/casa-lazer-2.jpg", "img/casa-lazer-3.jpg", "img/casa-lazer-4.jpg"], 
        linkZap: "https://wa.me/5521964495359?text=Olá! Gostaria de detalhes sobre a Casa Lazer em Heliópolis.",
        // Exemplo de link embed (Heliópolis - Belford Roxo)
        mapaLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14716.4153214572!2d-43.39991725!3d-22.76088745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99651261685797%3A0x339147c2c877123!2sHeli%C3%B3polis%2C%20Belford%20Roxo%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1677600100000!5m2!1spt-BR!2sbr"
    }
];

const listaContainer = document.getElementById('lista-imoveis');

// ... (Função carregarImoveis permanece igual) ...
function carregarImoveis() {
    listaContainer.innerHTML = "";
    imoveis.forEach((imovel) => {
        const cardHTML = `
            <div class="card" 
                 onmouseenter="startSlider(${imovel.id}, this)" 
                 onmouseleave="stopSlider()"
                 onclick="abrirModal(${imovel.id})">
                <img src="${imovel.imagens[0]}" alt="${imovel.titulo}" id="img-${imovel.id}" class="foto-imovel">
                <div class="card-content">
                    <h3>${imovel.titulo}</h3>
                    <p class="bairro-info"><i class="fas fa-map-marker-alt"></i> ${imovel.bairro}</p>
                    <p class="preco">${imovel.preco}</p>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 10px;">Toque para ver mais fotos e localização</p>
                </div>
            </div>
        `;
        listaContainer.innerHTML += cardHTML;
    });
}

// FUNÇÃO ATUALIZADA PARA ABRIR O MODAL COM MAPA
function abrirModal(id) {
    const imovel = imoveis.find(i => i.id === id);
    const modal = document.getElementById('modal-detalhes');
    const modalBody = document.getElementById('modal-body');

    // Cria a galeria
    let galeriaHTML = '<div class="modal-galeria">';
    imovel.imagens.forEach(img => {
        galeriaHTML += `<img src="${img}" alt="Foto do imóvel">`;
    });
    galeriaHTML += '</div>';

    // Monta o corpo do modal incluindo o MAPA
    modalBody.innerHTML = `
        <div class="modal-info">
            <h2>${imovel.titulo}</h2>
            <p class="bairro-info" style="font-size: 1rem;"><i class="fas fa-map-marker-alt"></i> ${imovel.bairro}</p>
            <p class="preco-modal">${imovel.preco}</p>
            
            ${galeriaHTML}
            
            <div class="descricao-completa">
                <strong><i class="fas fa-align-left"></i> Detalhes do Imóvel:</strong><br>
                ${imovel.detalhes}
            </div>

            <div class="mapa-container">
                 <h3><i class="fas fa-map-marked-alt"></i> Localização Aproximada</h3>
                 <iframe src="${imovel.mapaLink}" class="mapa-frame" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <a href="${imovel.linkZap}" class="btn-zap" target="_blank" style="width: 100%; max-width: 300px; margin: 20px auto 0;">
                <i class="fab fa-whatsapp"></i> Agendar Visita Agora
            </a>
        </div>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Evita rolar a página de trás
}

function fecharModal() {
    document.getElementById('modal-detalhes').style.display = "none";
    document.body.style.overflow = "auto"; // Libera a rolagem
}

// ... (Resto do código: window.onclick, slider e window.onload permanecem iguais) ...
window.onclick = function(event) { const modal = document.getElementById('modal-detalhes'); if (event.target == modal) fecharModal(); }
let intervalId;
function startSlider(id, cardElement) { /* ... código do slider ... */ }
function stopSlider() { clearInterval(intervalId); }
window.onload = carregarImoveis;