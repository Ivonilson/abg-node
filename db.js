const mysql = require('mysql2/promise');

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
    return global.connection;

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'controle_demandas'
    });

    console.log('Conectou ao MYSQL');
    global.connection = connection;
    return global.connection;
}

connect();

async function login(user, pass){
    const conn = await connect();
    const sql = 'SELECT * FROM tbl_user WHERE user = ? && pass = ? ;'
    const [result] = await conn.query(sql, [user, pass]);
    if(result.length > 0){
        return result;
    } else {
        return false;
    }
}

async function demandasDoDia(){
    const conn = await connect();
    const [rows] = await conn.query(
        'SELECT * FROM controle_demandas WHERE data_entrega = CURDATE();'
        );
    return rows;
}

async function carregarDadosTeste(){
    const conn = await connect();
    const [rows] = await conn.query(
        'SELECT * FROM teste;'
    );
    return rows;
}

async function inserirOs(os){
    const conn = await connect();
    const sql = "INSERT INTO controle_demandas (cod_os, tipo, banco, empresa, proponente, CONTATO, cidade, uf," + 
       "tipologia, observacoes, condominio, bairro, data_receb, data_entrega, valor_servico, valor_deslocamento," +
       "area_construida, area_terreno, padrao_acabamento, novo, LAJE, situacao, status, obs3, valor_avaliacao, obs2, notas_importantes)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?);";
    return await conn.query(
        sql, [
            os.codOs, os.tipo, os.banco, os.empresa, os.proponente, os.contato, os.cidade, os.uf,
            os.tipologia, os.endereco, os.condominio, os.bairro, os.dataReceb, os.dataEntrega,
            os.valorServ, os.valorDesloc, os.areaEdif, os.areaTerreno, os.padAcab, os.novo, os.laje,
            os.situacao, os.status, os.statusLista, os.valorAvaliacao, os.observacoesLista, os.observacoesIG
        ]
    );
}

async function inserirTeste(pessoa){
    const conn = await connect();
    const sql = "INSERT INTO teste (nome, sobrenome, data_receb, data_entrega) VALUES (?, ?, ?, ?);";
    return await conn.query(sql, [pessoa.nome, pessoa.sobrenome, pessoa.dataReceb, pessoa.dataEntrega]);
}

/**O.S para edição */
async function selectOs(id){
    const conn = await connect();
    const sql = "SELECT * FROM controle_demandas WHERE cod_os = ?";
    const [rows] = await conn.query(sql, [id.replace('-', '/')]);
    return rows && rows.length > 0 ? rows[0] : {}; 
}

/**Editando a O.S selecionada */
async function editarOs(cod_os, os){
    const conn = await connect();
    const sql = 'UPDATE controle_demandas SET  tipo = ?, banco = ?, empresa = ?, proponente = ?, CONTATO = ?, '+
    'cidade = ?, uf = ?, tipologia = ?, observacoes = ?, condominio = ?, bairro = ?, data_receb = ?, '+
    'data_entrega = ?, valor_servico = ?, valor_deslocamento = ?, valor_avaliacao = ?, area_construida = ?, '+
    'area_terreno = ?, padrao_acabamento = ?, novo = ?, LAJE = ?, situacao = ?, status = ?, obs3 = ?, obs2 = ?, '+
    'notas_importantes = ?, ficha_pesquisa = ?, numero_op_inter = ? WHERE cod_os = ?;';

    return await conn.query(sql, [os.tipo, os.banco, os.empresa, os.proponente, os.contato, os.cidade, os.uf, 
        os.tipologia, os.endereco, os.condominio, os.bairro, os.dataReceb, os.dataEntrega, os.valorServ,
        os.valorDesloc, os.valorAvaliacao, os.areaEdif, os.areaTerreno, os.padAcab, os.novo, os.laje, os.situacao, os.status,
        os.statusLista, os.observacoes, os.observacoesIG, os.fichaPesquisa, os.numeroOperacao, cod_os.replace('-', '/')]);
}

/** Cidade */
async function carregarcidade(){
    const conn = await connect();
    const sql = "SELECT * FROM tb_cidades";
    const [rows] = await conn.query(sql);
    return rows && rows.length > 0 ? rows : {};
}

/** UF */
async function carregarUF(){
    const conn = await connect();
    const sql = "SELECT * FROM tb_uf";
    const [rows] = await conn.query(sql);
    return rows && rows.length > 0 ? rows : {};
}

/**Deletando um registro */
async function deletarOs(id){
    const conn = await connect();
    return await conn.query('DELETE from controle_demandas WHERE cod_os = ?;', [id.replace('-', '/')]);
}

module.exports = {
    demandasDoDia, inserirOs, inserirTeste, carregarDadosTeste, selectOs, 
    carregarcidade, carregarUF, editarOs, deletarOs, login
};