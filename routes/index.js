var express = require('express');
const { data } = require('jquery');
const { selecionado } = require('../db');
var router = express.Router();

function ultima_atualizacao () {
  let data_hora_atual = new Date();
  return data_hora_atual.getHours() + ' h ' + data_hora_atual.getMinutes() + ' min de ' + data_hora_atual.getDate() + 
'/' + (data_hora_atual.getMonth() + 1) +  '/' + data_hora_atual.getFullYear();
};

router.get('/', async function(req, res, next) {

  try {

    res.render('login', 
    {
      title: 'Login', mensagem: null,
      alert: null, 
      tempo_alerta: null,
      negrito: 'fw-bold'
    });
  } catch (error){
    res.redirect('/erro='+error);
  }
});

/* GET home page. */
/*router.get('/', async function(req, res, next) {

  try {

    const results = await global.db.demandasDoDia();
    let sessao = req.session.name =  'IVONILSON';
    res.render('index', 
    {
      results, title: 'Controle de Demandas', mensagem: null, active: 'active', 
      alert: null, 
      tempo_alerta: null,
      negrito: 'fw-bold',
      ultima_atualizacao: ultima_atualizacao(),
      sessao
    });
  } catch (error){
    res.redirect('/erro='+error);
  }
});*/

router.get('/cadastrar-os', async function(req, res, next){
  const cidades = await global.db.carregarcidade();
  const ufs = await global.db.carregarUF();
  res.render('cadastrar-os', 
  {
    title: 'Cadastrar O.S.', mensagem: null, action: '/cadastrar-os', 
    active: 'active',
    negrito: 'fw-bold',
    cidades,
    ufs
  });
});

router.get('/teste', async function(req, res, next){
  const results = await global.db.carregarDadosTeste();
  res.render('teste', 
  {
    title: 'Teste', results, mensagem: null, action: '/teste', 
    active: 'active',
    negrito: 'fw-bold'
  });
});

router.post('/teste', async function(req, res){
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  const dataReceb = req.body.iptDataReceb;
  const dataEntrega = req.body.iptDataEntrega;
  try {
    await global.db.inserirTeste({nome, sobrenome, dataReceb, dataEntrega});
    const results = await global.db.carregarDadosTeste();
    res.render('teste', 
    {
      title: 'Teste', results, mensagem:  'Cadastrado com sucesso', 
      action: '/teste', active: 'active',
      alert: 'alert-info',
      tempo_alerta: 'mensagem-alerta-erro',
      negrito: 'fw-bold'
    });
  } catch(error){
    const results = await global.db.carregarDadosTeste();
    res.render('teste', 
    {
      title: 'Teste', results, mensagem:  error, action: '/teste', 
      active: 'active',
      alert: 'alert-danger',
      tempo_alerta: '',
      negrito: 'fw-bold'
    });
  }
});

/**POST incluir NOVA O.S */
router.post('/cadastrar-os',  async function(req, res){
  const codOs = req.body.iptOs;
  const tipo = req.body.selTipo;
  const banco = req.body.selBanco;
  const empresa = req.body.selEmpresa;
  const proponente = req.body.iptProponente;
  const contato = req.body.iptContato;
  const cidade = req.body.selCidade;
  const uf = req.body.selUf;
  const tipologia = req.body.selTipologia;
  const endereco = req.body.iptEndereco;
  const condominio = req.body.iptCondominio;
  const bairro = req.body.iptBairro;
  const dataReceb = req.body.iptDataReceb;
  const dataEntrega = req.body.iptDataEntrega;
  const valorServ = (req.body.iptValorServ.replace('.', '')).replace(',', '.');
  const valorDesloc = (req.body.iptValorDesloc.replace('.', '')).replace(',', '.');
  const areaEdif = (req.body.iptAreaEdif.replace('.', '')).replace(',', '.');
  const areaTerreno = (req.body.iptAreaTerreno.replace('.', '')).replace(',', '.');
  const situacao = req.body.selSituacao;
  const status = req.body.selStatus;
  const statusLista = req.body.selStatusLista;
  const observacoesLista = req.body.taObservacoes;
  const observacoesIG = req.body.taObservacoesig;

  try {
    const cidades = await global.db.carregarcidade();
    const ufs = await global.db.carregarUF();
    await global.db.inserirOs({
      codOs, tipo, banco, empresa, proponente, contato, cidade, uf, tipologia, endereco,
      condominio, bairro, dataReceb, dataEntrega, valorServ, valorDesloc, areaEdif, areaTerreno
      , situacao, status, statusLista, observacoesLista, observacoesIG
    });
    res.render('cadastrar-os', 
    {
      mensagem: 'Cadastrado com sucesso', title: 'Cadastrar O.S.', 
      action: '/cadastrar-os', active: 'active',
      alert: 'alert-success',
      tempo_alerta: 'mensagem-alerta-erro',
      negrito: 'fw-bold',
      cidades,
      ufs
    });
  } catch(error){
    const cidades = await global.db.carregarcidade();
    const ufs = await global.db.carregarUF();
    res.render('cadastrar-os', 
    {
      mensagem: error, title: 'Cadastrar O.S.', 
      action: '/cadastrar-os', active: 'active',
      alert: 'alert-danger',
      tempo_alerta: '',
      negrito: 'fw-bold',
      cidades,
      ufs
    });
  }
});

/**Carregando O.S para edição */
router.get('/edit/:id', async function (req, res){
  const id = req.params.id;
  try{
    const result = await global.db.selectOs(id);
    const cidades = await global.db.carregarcidade();
    const ufs = await global.db.carregarUF();
    res.render('editar-os', 
    {
    mensagem: null, result, cidades, ufs, title: 'O.S em Edição', action: '/edit/'+id, 
    active: 'active', negrito: 'fw-bold'
  });
  } catch (error){
    res.render('editar-os', 
    {
    mensagem: error, result, title: 'O.S. em edição', action: '/edit/'+id, 
    active: 'active', negrito: 'fw-bold'
  });
    //res.redirect('/erro='+error);
  }
});

/**Editando a O.S. selecionada */
router.post('/edit/:id', async function(req, res){
  let sessao = req.session.name =  'IVONILSON';
  const cod_os = req.params.id;
  const tipo = req.body.selTipo;
  const banco = req.body.selBanco;
  const empresa = req.body.selEmpresa;
  const proponente = req.body.iptProponente;
  const contato = req.body.iptContato;
  const cidade = req.body.selCidade;
  const uf = req.body.selUf;
  const tipologia = req.body.selTipologia;
  const endereco = req.body.iptEndereco;
  const condominio = req.body.iptCondominio;
  const bairro = req.body.iptBairro;
  const dataReceb = req.body.iptDataReceb;
  const dataEntrega = req.body.iptDataEntrega;
  const valorServ = (req.body.iptValorServ.replace('.', '')).replace(',', '.');
  const valorDesloc = (req.body.iptValorDesloc.replace('.', '')).replace(',', '.');
  const valorAvaliacao = (req.body.iptValorAvaliacao.replace('.', '')).replace(',', '.');
  const areaEdif = (req.body.iptAreaEdif.replace('.' , '')).replace(',', '.');
  const areaTerreno = (req.body.iptAreaTerreno.replace('.', '')).replace(',', '.');
  const padAcab = req.body.selPadraoAcab;
  const novo = req.body.selNovo;
  const laje = req.body.selLaje;
  const situacao = req.body.selSituacao;
  const status = req.body.selStatus; 
  const statusLista = req.body.selStatusLista;
  const observacoes = req.body.taObservacoes;
  const observacoesIG = req.body.taObservacoesig;
  const fichaPesquisa =  req.body.selFichaPesquisa != null ? req.body.selFichaPesquisa : null;
  const numeroOperacao = req.body.iptNumeroOperacao != null ? req.body.iptNumeroOperacao : null;
  
  try {

    await global.db.editarOs(cod_os, {
        tipo, banco, empresa, proponente, contato, cidade,
        uf, tipologia, endereco, condominio, bairro, dataReceb, dataEntrega, valorServ, valorDesloc,
        valorAvaliacao, areaEdif, areaTerreno,  padAcab, novo, laje, situacao,  status, statusLista, observacoes,
        observacoesIG, fichaPesquisa, numeroOperacao
    });
    const results = await global.db.demandasDoDia();
    res.render('index'  , 
    {
      results,
      mensagem: 'O.S. n° ' + cod_os.replace('-', '/') + ' atualizada com sucesso!', 
      title: 'Controle de Demandas',
      active: 'active',
      alert: 'alert-success',
      tempo_alerta: 'mensagem-alerta-erro',
      negrito: 'fw-bold',
      ultima_atualizacao: ultima_atualizacao(),
      sessao

    });
   
  } catch(error){
    //res.redirect('/?erro= '+error)
    const id = req.params.id;
    const cidades = await global.db.carregarcidade();
    const ufs = await global.db.carregarUF();
    const result = await global.db.selectOs(id);
    res.render('editar-os', 
    {
    mensagem: 'Erro ao atualizar a O.S. n° ' + cod_os.replace('-', '/') + ' ( '+ error + ')', 
    result, cidades, ufs, 
    title: 'O.S em Edição', 
    action: '/edit/'+id,
    active: 'active',
    alert: 'alert-danger',
    tempo_alerta: '',
    negrito: 'fw-bold',
    ultima_atualizacao: ultima_atualizacao(),
    sessao
  });
  }
});

router.get('/delete/:id', async function(req, res){
  const id = req.params.id;
  try {
    await global.db.deletarOs(id);
    let sessao = req.session.name =  'IVONILSON';
    const results = await global.db.demandasDoDia();
    res.render('index', 
    {
      results,
      mensagem: 'O.S. n° ' + id.replace('-', '/') + ' deletada com sucesso!', 
      //mensagem: '',
      title: 'Controle de Demandas',
      active: 'active',
      alert: 'alert-success',
      tempo_alerta: 'mensagem-alerta-erro',
      negrito: 'fw-bold',
      ultima_atualizacao: ultima_atualizacao(),
      sessao
    });
    //res.redirect('/?delete=true');
  } catch(error){
  const results = await global.db.demandasDoDia();
   res.render('index', 
    {
      results,
      mensagem: 'Erro ao deletar a O.S. n° ' + id.replace('-', '/') + ' ( '+ error + ')', 
      //mensagem: '',
      title: 'Controle de Demandas',
      active: 'active',
      alert: 'alert-danger',
      tempo_alerta: '',
      negrito: 'fw-bold',
      ultima_atualizacao: ultima_atualizacao(),
      sessao
    });
    //res.redirect('/?error= '+error);
  }
});

module.exports = router;
