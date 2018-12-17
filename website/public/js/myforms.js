
/*!
 * jQuery ValidateMe 1.0 beta
 *
 * Copyright 2013 STANLEY
 * Released under the MIT license
 *
 * Date: 14/08/2013
 */

jQuery.fn.ValidateMe=function(parametros){
    //valores padrao
    idform=jQuery(this).attr("id");
    padrao={
        //nome do formulario
        formname:"",
        //true ou false (mostrar o erro)
        showmessage:true,
        //classe, id etc (nome do local que vai receber um shake)
        placetoshake:idform,
        //true ou false (alertar ao usuario com efeito no formulario)
        shake:false,
        //fixed ou relative (posicao do alerta de erro - topo do site ou fim do formulario)
        alertposition:"fixed",
        //mensagem de erro
        customerrormessage:"Por favor, preencha os campos obrigatórios!"
    }
    //se houve escolha de parametros substituir nos padroes
    parametros=jQuery.extend(padrao,parametros);

    //ao submeter formulario
    jQuery(this).submit(function(){

        //pegar o id do formulario q postou
        id=jQuery(this).attr("id");

        var erro=0;
        var contadorerro=0;

        jQuery("#"+id+" .required").each(function(i){
            //pegar o valor do campo
            valor=jQuery(this).val();
            //tipo do campo
            tipo=jQuery(this).attr("type");
            //se o tipo for radio button ou checkbox
            if(tipo=="radio" || tipo=="checkbox"){
                nomecampo=jQuery(this).attr("name");
                if(jQuery("input[name="+nomecampo+"]").is(":checked")){
                    //remover esta classe
                    jQuery(this).removeClass("campoerro2");
                }
                else{
                    //adicionar classe para mudar aparencia do campo vazio
                    jQuery(this).addClass("campoerro2");
                    //setar erro
                    erro=1;
                }
            }
            else{
                //se este valor estiver vazio
                if(valor==""){
                    //adicionar classe para mudar aparencia do campo vazio
                    jQuery(this).addClass("campoerro");
                    //pegar valor de mensagem de erro do campo
                    mensagemerro=jQuery(this).attr("mensagemerro");
                    //se nao informar a mensagem de erro
                    if(typeof(mensagemerro)=="undefined" || mensagemerro==""){
                        //usar mensagem padrao
                        mensagemerro="Este campo é obrigatório! Por favor, preencha-o.";
                    }
                    //criar div com a mensagem
                    //jQuery(this).after("<div class='mensagemerro'>"+mensagemerro+"</div>");
                    //se o contador ainda estiver como 0
                    if(contadorerro==0){
                        //colocar a classe foco no campo vazio atual
                        jQuery(this).addClass("foco");
                        //setar 1 na variavel para nao repetir esse comando anterior
                        contadorerro=1;
                    }
                    //setar erro
                    erro=1;
                }
                else{
                    //remover classe para mudar aparencia do campo vazio
                    jQuery(this).removeClass("campoerro");
                    //criar div com a mensagem
                    //jQuery(this).remove("<div class='mensagemerro'></div>");
                }
                //verifica se o campo precisa ser validado - forca de senha
                passVal=jQuery(this).attr("passval");
                if(passVal){
                    //variaveis para identificar se tem os valores necessitados
                    var isWord=false;
                    var isNum=false;
                    var isTam=false;

                    if(valor.match(/[a-z]/) || valor.match(/[A-Z]/)){
                        isWord=true;
                    }
                    if(valor.match(/[0-9]/)){
                        isNum=true;
                    }
                    if(valor.length>6){
                        isTam=true;
                    }
                    //verificar se tem os 3
                    if(isWord==true && isLower==true && isTam==true && valor!=""){
                        jQuery(this).removeClass("campoerro");
                        //remover erro
                        erro=0;
                    }
                    else{
                        jQuery(this).addClass("campoerro")
                        //setar erro
                        erro=1;
                    }
                }
            }
        });
        //caso haja algum campo vazio
        if(erro==1){
            //dar foco no campo vazio setado com a classe foco no laco acima
            jQuery(".foco").focus();

            //tipo de posicao escolhida
            if(parametros.showmessage==true){
                //formatacao da caixa de alerta
                boxerro=jQuery("<div class='boxerro' style='position:"+parametros.alertposition+"'></div>").text(parametros.customerrormessage);
                //mostrar caixa de erro e depois de 2 segundos esconde-la
                jQuery(boxerro).hide().appendTo("#"+id).fadeIn("slow").delay(2000).fadeOut("slow");
            }

            //se estiver habilitado a possibilidade de 
            if(parametros.shake==true){
                //fazer efeito shake na div
                var contador=0;
                for(var i=0;i<3;i++){
                    jQuery(parametros.placetoshake)
                        .animate({
                            marginLeft:"-10px"
                        },50)
                        .animate({
                            marginLeft:"10px",
                        },50)
                        .animate({
                            marginLeft:"0",
                        },50);
                }
            }
            //cancelar o post do formulario
            return false;
        }
        else{
            jQuery("#form").find(".showloading").text("PROCESSANDO...");
        }
    });
}

//utilizando a API da "widenet" -> apps.widenet.com.br/busca-cep/api-de-consulta
//buscar endereco por cep
jQuery(".bycepsearch").blur(
    function(){

        var cep_code = jQuery(this).val();
        if(cep_code.length <= 0)
            return;

        jQuery.get("http://apps.widenet.com.br/busca-cep/api/cep.json", { code: cep_code },
            function(result){
                if(result.status != 1){
                    alert(result.message || "Houve um erro desconhecido");
                    return;
                }

                jQuery("input#bycep").val(result.code);
                jQuery("#bystate").val(result.state);
                jQuery("input#bycity").val(result.city);
                jQuery("input#bydistrict").val(result.district);
                //corrigir endereco
                address = result.address.split(" -");
                jQuery("input#bystreet").val(address[0]);
                jQuery("input#bynumber").focus();
            }
        );
    }
);