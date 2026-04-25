// URL da sua API
const API_URL = 'http://localhost:3000';

async function buscarDados() {
    // 1. Buscar Cotações
    try {
        const resCotacoes = await fetch(`${API_URL}/cotacoes`);
        const cotacoes = await resCotacoes.json();
        
        const divCotacoes = document.getElementById('lista-cotacoes');
        divCotacoes.innerHTML = ''; // Limpa o "Carregando..."

        cotacoes.forEach(item => {
    // Formata o valor para Real (R$)
    const valorFormatado = Number(item.valor).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });

    // Formata a data para o padrão brasileiro
    const dataBr = new Date(item.data_cotacao).toLocaleDateString('pt-BR');

    divCotacoes.innerHTML += `
        <div class="card-cotacao">
            <strong>${item.produto}</strong>
            <div class="preco-valor">${valorFormatado}</div>
            <div class="info-secundaria">
                📅 ${dataBr} | 🏢 ${item.fonte} <br>
                📦 ${item.unidade}
            </div>
        </div>
    `;
});
    } catch (error) {
        console.error("Erro cotacoes:", error);
    }


    // 2. Buscar Cooperativas
    try {
        const resCoop = await fetch(`${API_URL}/cooperativas`);
        const cooperativas = await resCoop.json();
        
        const divCoop = document.getElementById('lista-cooperativas');
        divCoop.innerHTML = '';

        if(cooperativas.length === 0) {
            divCoop.innerHTML = "Nenhuma cooperativa cadastrada.";
        } else {
            // SE EXISTIREM COOPERATIVAS, CHAMA O MAPA AQUI!
            iniciarMapa(cooperativas); 
        }

        cooperativas.forEach(coop => {
            divCoop.innerHTML += `
                <div style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; border-left: 3px solid var(--verde);">
                    <strong>${coop.nome}</strong><br>
                    <small>📍 ${coop.cidade} | 📞 ${coop.telefone}</small>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro cooperativas:", error);
    }
}

function iniciarMapa(cooperativas) {
    // Foca o mapa em Poço Fundo
    const map = L.map('map-container').setView([-21.78, -45.96], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Coloca um pino para cada cooperativa vinda do banco
    cooperativas.forEach(coop => {
        if (coop.latitude && coop.longitude) {
            L.marker([coop.latitude, coop.longitude])
                .addTo(map)
                .bindPopup(`<b>${coop.nome}</b><br>${coop.telefone}`);
        }
    });
}

// Inicia a busca assim que a página abre
window.onload = buscarDados;