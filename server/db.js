const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agrohub'
});

// TESTE DE CONEXÃO IMEDIATO
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('Conexão com o banco fechada.');
        if (err.code === 'ER_CON_COUNT_ERROR') console.error('Muitas conexões abertas.');
        if (err.code === 'ECONNREFUSED') console.error('CONEXÃO RECUSADA: O MySQL está ligado?');
        if (err.code === 'ER_BAD_DB_ERROR') console.error('BANCO NÃO EXISTE: Verifique o nome agrohub.');
        console.error('ERRO COMPLETO:', err);
    }
    if (connection) {
        console.log('✅ SUCESSO: Conectado ao banco agrohub!');
        connection.release();
    }
});

module.exports = pool.promise();