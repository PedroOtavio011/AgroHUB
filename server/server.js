const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.get ('/cooperativas', async (req, res) => {
    try{
        const [rows] = await db.query('SELECT * FROM cooperativas ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao buscar cooperativas' });
    }

});

app.get('/cotacoes', async (req, res) => {
    try {
    const [rows] = await db.query('SELECT * FROM cotacoes ORDER BY data_cotacao DESC');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao buscar cotacoes' });
    }
});

app.get('/anuncios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM anuncios WHERE status = "ativo" ORDER BY data_publicacao DESC');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao buscar anuncios' });
    }
});

const axios = require('axios');

// Função que busca o Dólar e salva no banco
async function atualizarDolarAutomatico() {
    try {
        const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL');
        const dolar = response.data.USDBRL;
        const preco = parseFloat(dolar.bid);

        // Insere na sua tabela de cotações
        const sql = `
            INSERT INTO cotacoes (produto, valor, unidade, fonte, data_cotacao) 
            VALUES (?, ?, ?, ?, CURDATE())
        `;
        
        await db.query(sql, ['Dólar Comercial', preco, 'Moeda', 'AwesomeAPI']);
        
        console.log(`✅ [${new Date().toLocaleTimeString()}] Dólar atualizado: R$ ${preco}`);
    } catch (error) {
        console.error("❌ Falha ao buscar cotação automática:", error.message);
    }
}

// Executa a função assim que o servidor liga
atualizarDolarAutomatico();





app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});