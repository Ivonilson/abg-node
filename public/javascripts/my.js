$(function () {
    $('#table_id').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [ {
        extend: 'colvis',
        text: 'Marcar/Desmarcar colunas'
       /*columnText: function ( dt, idx, title ) {
            return (idx+1)+': '+title;
        }*/
    } ]
    }),
    
    $('#table_teste').DataTable()
});

$(function(){
    $(".mensagem-alerta-sucesso").fadeIn(300).delay(2000).fadeOut(400);
});

$(function(){
    $(".mensagem-alerta-erro").fadeIn(300).delay(6000).fadeOut(400);
});

function configurarBarra(){
    setInterval(() => {
        let percentual = ((parseInt(document.getElementById('qtdlaudoPronto').innerHTML)) / (parseInt(document.getElementById('qtdDemandas').innerHTML))) *  100 ;
       // let percentual = (7/10) * 100;
        if(isNaN(percentual)){1
            percentual = 100;
        }
        const valorDiv = document.querySelector(`[barra-progresso] > div`);
        const valorDivExterna = document.querySelector(`[barra-progresso]`);
        valorDiv.style.width = `${percentual}%`;
        valorDiv.innerHTML = `${percentual.toFixed(2)}%`;
            if(percentual == 100){
                valorDiv.style.backgroundColor = '#3CB371';
                valorDivExterna.style.borderColor = '#3CB371';
            }
            if(percentual <= 9){
                valorDiv.style.backgroundColor = '#F8F8FF';
                valorDiv.style.color = '#DC143C';
            }
    }, 500)
 }