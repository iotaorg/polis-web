function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
jQuery(document).ready(function($) {
    "use strict";

    /* inicio pesquisa */
    var $search = $('.srch-term'),
        $itens_acoes = $('.acoes-itens'),
        $txt_info = $('#stxt'),
        _last_filter = '',
        _ajax_acoes = function() {
            var valor = $.trim($search.val());

            if (valor == _last_filter) return;
            _last_filter = valor;

            if (valor == '') {
                _filter_acoes([], false);
            } else {
                $txt_info.html('Pesquisando...').addClass('loading').removeClass('notfound');

                // no pior caso, mostra acoes, que é sempre vazio = todas
                var acoes = [];
                $.ajax({
                    url: '/ajax/pesquisa-acao',
                    data: {
                        q: valor
                    },
                    dataType: "json",
                }).success(function(e) {

                    acoes = e.ids;
                    _filter_acoes(acoes, true);
                }).error(function() {
                    $txt_info.html('Ocorreu um erro com sua pesquisa...').removeClass('loading').addClass('notfound');
                });


            }
        },
        _filter_acoes = function(who, is_ajax) {

            if (who.length == 0) {
                $itens_acoes.show();
                var txt_fixo = is_ajax ? 'Nenhum resultado encontrado. Exibindo todas as ações' : ('Exibindo ' + $itens_acoes.length + ' ações');
                $txt_info.html(txt_fixo).removeClass('loading');

                if (is_ajax) $txt_info.addClass('notfound');
            } else {
                $txt_info.html('Exibindo ' + who.length + ' ações').removeClass('loading');

                $itens_acoes.hide();
                $.each(who, function(i, e) {
                    $('#acao' + e).show()
                })
            }
        };
    if ($search[0]) {
        $search.on('keyup', debounce(_ajax_acoes, 150));
        //_filter_acoes([]);
    }
    /* final pesquisa */

    /* filtro pelo eixo */
    var $eixo_wrap = $('.eixo-wrap'),
        eixo_num = getUrlParameter('eixo'),
        _click_to_filter = function() {
            var $me = $(this);
            $search.val('eixo ' + $me.attr('data-eixo')).trigger('keyup');
            var target = $( '.filtros-eixos-wrap' );

            if( target.length ) {
                event.preventDefault();

                if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
                    window.setTimeout(function() {
                        window.scrollTo(0,target.offset().top - 69)
                    },0);
                }else{
                    $('html, body').animate({
                        scrollTop: target.offset().top - 69
                    }, 500);
                }
            }
        };
    $eixo_wrap.on('click', _click_to_filter);
    // ativa o eixo caso venha no parametro
    if (eixo_num)
        $eixo_wrap.filter('[data-eixo="'+eixo_num+'"]').click();

    /* fianl filtro pelo eixo*/

    /* carregar dados indicadores */

    var $indicadores = $('.tab-indicador'),
        _carrega_tabela_indicador = function(e) {

            var $self = $(e),
                id = $self.attr('data-id'),
                vt = $self.attr('data-variable-type');

            $.ajax({
                url: '/ajax/indicador_tabela_rot_regiao',
                data: {
                    id: id,
                    variable_type: vt,
                    js: 1
                },
                dataType: "html",
            }).success(function(e) {
                $self.find('.table').html(e);

                if (!(vt === 'str')) {
                    _carrega_flot_graph($self, $.parseJSON($self.find('div[data-json]').attr('data-json')))
                }
            }).error(function() {
                $self.find('.table').html('Ocorreu um erro ao carregar os dados...');
            });

        },

        _carrega_flot_graph = function($where, graph) {
            $where = $where.find('.graph').html('');

            var datasets = {};

            $.each(graph.headers, function(i, region) {

                var data = [];
                $.each(graph.lines, function(i, when) {
                    data.push([when.v, graph.data[when.k] ? graph.data[when.k][region.k] : undefined]);
                });

                datasets[region.k] = {
                    label: region.v,
                    data: data
                };
            });
            var i = 0;
            $.each(datasets, function(key, val) {
                val.color = i;
                ++i;
            });

            // insert checkboxes
            var choiceContainer = $where.append('<div style="width: 18%; float:right; font-size: 0.8em" class="a form-group"></div>').find('.a');

            $.each(datasets, function(key, val) {
                choiceContainer.append("<div class='checkbox'><label><input type='checkbox' name='" + key +
                    "' checked='checked'></input>" + val.label + "</label></div>");
            });

            var $graph_div = choiceContainer.parent().append('<div style="float:left; width: 80%; min-height: 500px" class="b"></div>').find('.b');
            choiceContainer.find("input").click(plotAccordingToChoices);


            function plotAccordingToChoices() {

                var data = [];

                choiceContainer.find("input:checked").each(function() {
                    var key = $(this).attr("name");
                    if (key && datasets[key]) {
                        data.push(datasets[key]);
                    }
                });

                if (data.length > 0) {
                    var plot = $.plot($graph_div, data, {
                        yaxis: {
                            autoscaleMargin: 0.5
                        },
                        series: {
                            lines: {
                                show: true
                            },
                            points: {
                                show: true
                            }
                        },
                        legend: {
                            noColumns: 2
                        },
                        xaxis: {
                            tickDecimals: 2
                        }
                    });
                }

            }

            plotAccordingToChoices();

            $(window).bind('resize', debounce(function (){
                    plotAccordingToChoices();
            }, 100))

            //$search.on('keyup', debounce(_ajax_acoes, 150));

        };

    $indicadores.each(function(i, e) {
        _carrega_tabela_indicador(e)
    })

    /* fim indicadores */

    /* mapa */

    var map = L.map('map').setView([-24.30410,-47.0230740], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.light'
        }).addTo(map);

        var baseballIcon = L.icon({
            iconUrl: 'baseball-marker.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        });

        function onEachFeature(feature, layer) {
            var popupContent = "";

            if (feature.properties && feature.properties.PopupInfo) {
                popupContent += feature.properties.PopupInfo;
            }

            layer.bindPopup(popupContent);
        }

        L.geoJson(
 [
    {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },

"features": [
{ "type": "Feature", "properties": { "Name": "Aeroporto de Itanhaém", "PopupInfo": "DETALHES: PROJETO: Concessão do Aeroporto de Itanhaém <br> OBSERVAÇÃO: Investimento do concessionário programado de R$9,2 milhões<br>TIPO: Aeroportuário<br><br>MUNICÍPIO: Itanhaém<br><br>ELABORAÇÃO: Instituto Pólis 2015 <br>FONTE: Ministério do Planejame", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "airport" }, "geometry": { "type": "Point", "coordinates": [ -46.789875, -24.161039, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Aeroporto do Guarujá", "PopupInfo": "DETALHES: PROJETO: Aeroporto Civil Metropolitano<br>TIPO: Aeroportuário<br><br>MUNICÍPIO: Guarujá<br><br>ELABORAÇÃO: Instituto Pólis 2015 <br>FONTE: Câmara Temática 'Diálogo Sobre Empreendimentos no Litoral Paulista' <br><br>TIPO: Aeroportuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "airport" }, "geometry": { "type": "Point", "coordinates": [ -46.300651, -23.92858, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Aeroporto de Ubatuba", "PopupInfo": "DETALHES: PROJETO: Concessão do Aeroporto de Ubatuba <br> OBSERVAÇÃO: Investimento do concessionário programado de R$12,7 milhões.<br>TIPO: Aeroportuário<br><br>MUNICÍPIO: Ubatuba<br><br>ELABORAÇÃO: Instituto Pólis 2015 <br>FONTE: Ministério do Planejame", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "airport" }, "geometry": { "type": "Point", "coordinates": [ -45.07419, -23.441464, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Valongo)", "PopupInfo": "DETALHES: PROJETO: Revitalização do Porto do Valongo<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Localização do porto sem detalhes da implantação do projeto: Jul. 2015) <br>FONTE: Câmara Temática 'Diálogos sobre Grande", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.334766, -23.930062, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Cais de Outeirinhos)", "PopupInfo": "DETALHES: PROJETO: Retificação do cais de Outeirinhos<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Localização do cais sem detalhes do projeto: Jul. 2015) <br>FONTE: Câmara Temática 'Diálogos sobre Grandes Empreendiment", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.307526, -23.959556, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Canal do Porto)", "PopupInfo": "DETALHES: PROJETO: Dragagem e aprofundamento do canal do Porto de Santos<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Identificação do canal sem detalhes da localização da intervenção: Jul. 2015) <br>FONTE: Câmara Temát", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.310148, -23.943975, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de São Sebastião", "PopupInfo": "DETALHES: PROJETO: Ampliação do Porto de São Sebastião<br>TIPO: Portuário<br><br>MUNICÍPIO: São Sebastião<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015) <br>FONTE: Companhia das Docas de São Sebastião (EIA\/RIMA 2009)<br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -45.401933, -23.815979, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Alemoa)", "PopupInfo": "DETALHES: PROJETO: Terminal Marítimo da Alemoa<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015)<br>FONTE: Alemoa S\/A Imóveis e Participações (EIA\/RIMA 2009) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.386644, -23.921049, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Complexo de Bagres)", "PopupInfo": "DETALHES: PROJETO: Complexo Bagres<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015) <br>FONTE: São Paulo Empreendimentos Portuários Ltda (EIA\/RIMA 2010) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.351258, -23.912996, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (BTP)", "PopupInfo": "DETALHES: PROJETO: BTP - Brasil Terminal Portuário<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015) <br>FONTE: BTP - Brasil Terminal Portuário (EIA\/RIMA 2008) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.351674, -23.92409, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (Embraport)", "PopupInfo": "DETALHES: PROJETO: Terminal Portuário Embraport<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015)<br>FONTE: Empresa Brasileira de Terminais Portuários S.A. (EIA\/RIMA 2003) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.314095, -23.917351, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (regularização)", "PopupInfo": "DETALHES: PROJETO: Regularização do Porto Organizado de Santos<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015) <br>FONTE: Porto de Santos (EIA 2011) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.312886, -23.946412, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Porto de Santos (TUF)", "PopupInfo": "DETALHES: PROJETO: TUF - Terminal Marítimo Ultraferril<br>TIPO: Portuário<br><br>MUNICÍPIO: Santos<br><br>ELABORAÇÃO: Instituto Pólis (Jul. 2015)<br>FONTE: Ultraferril S.A. (RIMA 2011) <br><br>TIPO: Portuário", "CLASSE": "PORTOS E AEROPORTOS", "fillColor": "#00BFFF", "Simbolo": "ferry" }, "geometry": { "type": "Point", "coordinates": [ -46.36891, -23.870836, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Plataforma de Mexilhão", "PopupInfo": "<img src=\"https:\/\/lh4.googleusercontent.com\/proxy\/xBsBONwIGGX7l9UItrPowFhf3SlfMmItZRzlBJBw7IGaqUDhD5TR9PwxmkiM_Ko8wAraTpJVcAjmK_5zFHhCvqdZNjVW0XyP7OMNavpBwWgEMg\" height=\"200\" width=\"auto\" \/><br><br>DETALHES: SIGLA: PMXL-1 <br>PLATAFORMA: Unidade tipo \"Ja", "CLASSE": "PETRÓLEO E GÁS", "marker-color": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -44.375801, -24.359956, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Plataforma de Merluza", "PopupInfo": "<img src=\"https:\/\/lh3.googleusercontent.com\/proxy\/53N0IxFCRATYciHVwEuA22uCYE7PH_C8UBKpUax9Yjder75NJ_MrM5dhYl6pj3_SntS35rYt5hbVa3NVyT3EA6JrqYwuKflDdPRr\" height=\"200\" width=\"auto\" \/><br><br>DETALHES: SIGLA: PMLZ-1 <br>PLATAFORMA: Unidade tipo \"Jaqueta\"<br>", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -45.24749, -25.272757, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CIT", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br><br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -46.524784, -26.473221, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CSP", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -43.202362, -25.677717, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CIB", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -43.257388, -25.802761, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CAR", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.835592, -25.551174, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CPY", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.758503, -25.39884, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CIG", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.87552, -25.208231, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CMB", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.940006, -25.148137, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CSV", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.448555, -24.941567, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPWSO DYNA", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.488883, -24.636274, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "FPSO CST", "PopupInfo": "DETALHES: PLATAFORMA: \"Unidade flutante\" FPSO<br>TIPO: Unidade de Produção Marítima<br><br>BACIA: Bacia de Santos<br><br>FONTE: Petrobras 2015 <br>TIPO: Unidade de Produção Marítima (FPSO)", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -42.711763, -24.306763, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Refinaria de Paulínia", "PopupInfo": "<img src=\"https:\/\/lh5.googleusercontent.com\/proxy\/SUX9FDLTd0cNiwHCwqYaiRzRWREv81LqEO_o3QXMqmPDRHkoZhP9jeakndKGddOB58jofZii7lKp0kX3jo4DvSiOoaxt5l-bUlLi4cwgCvhxubX-9uTidGg-L-9FnPYJfvE_AUwjWvmue1GjeeXyeAaKLjdOYUs\" height=\"200\" width=\"auto\" \/><br><br>DETALHE", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "star" }, "geometry": { "type": "Point", "coordinates": [ -47.125517, -22.729569, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Reinaria Duque de Caxias", "PopupInfo": "<img src=\"https:\/\/lh6.googleusercontent.com\/proxy\/uMgnJovmB9v4nK0dJSdYw4m09KYap2GosF81ZuQSlddty1jh2KD6BZyXDoSodN609FbrE5_0li97FFiVE3rnXpiY6-Z_RtNd8iGsNYf_h3Ouvak8WteFDaVw-xqB5x6gt5vThO6VH6JdMNyLm2ikg2LjK2OlHIEVj_A3_wUuwCvUqw\" height=\"200\" width=\"auto\" \/>", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "star" }, "geometry": { "type": "Point", "coordinates": [ -43.269974, -22.718215, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Refinaria Presidente Bernardes", "PopupInfo": "<img src=\"https:\/\/lh6.googleusercontent.com\/proxy\/2ShEIFIx6FJq_LVOu6ZZt6eZO8iZu1VvhDJdlKdEZ1PvfpjUQ4mMzxr0XqJdtlFjQe73uzmRPyOPMzjN77EqeK8ZaLc9RAq9N-EuXUYDPtiRUjeplpVO9c0prBOSz6iHr4uFwNgWwSw86UGLIasX5owHdI7j2iLSZTu1YGYxoTNoeXBsnDg\" height=\"200\" width=\"aut", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "star" }, "geometry": { "type": "Point", "coordinates": [ -46.427141, -23.867618, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Refinaria de Capuava", "PopupInfo": "<img src=\"https:\/\/lh3.googleusercontent.com\/proxy\/mWUQQkhRKyHaicYaolnyb6b4zVmq64ARsG3TXGk5BA_-4jU5uWL0MB6KOg-EDPumyuhUGD8bfy_TfA12MzCcfykGXlcvDPejnXlYhbFgLMDDbZDnfz6EUpW8LXyFCPeU94w4L8SAjDDo08G1vFPwO303NLfDU7WTCMQhrw\" height=\"200\" width=\"auto\" \/><br><br>", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "star" }, "geometry": { "type": "Point", "coordinates": [ -46.479741, -23.64784, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Refinaria Henrique Laje", "PopupInfo": "<img src=\"https:\/\/lh4.googleusercontent.com\/proxy\/wFzkOGPksGYb8keSJMuvxlYi5BTmrZskRwcnXmjPQAB_GPzEvL6F878v3BEchRbS0aFdImSeA2HPblliunyGRwrZXjA1w9z8QrHCxOID-_cf_k-R4bCMsg_Ku3W2V6Ol79-XjD_xKMynGkSKmHU-JndZn_af0hCRi59l\" height=\"200\" width=\"auto\" \/><br><br>DE", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "star" }, "geometry": { "type": "Point", "coordinates": [ -45.831661499999939, -23.198513299999945, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Terminal Almirante Barroso", "PopupInfo": "DETALHES: SIGLA: TEBAR <br>OPERADOR: DTCS - Dutos e Terminais do Centro Sul <br> TIPO: Terminal marítimo<br> <br>MUNICÍPIO: São Sebastião <br><br> FONTE: Petrobras 2015<br><br>TIPO: Terminal", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -45.389041, -23.804124, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Unidade de Tratamento de Gás Monteiro Lobato", "PopupInfo": "DETALHES: SIGLA: UTGCA <br>OPERADOR: Petrobras <br>TIPO: Unidade de Produção de Gás<br><br> MUNICÍPIO: Caraguatatuba <br><br> FONTE: Petrobras 2015<br><br>TIPO: Unidade de Produção de Gás", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -45.504017, -23.654711, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Terminal de Cabiúnas", "PopupInfo": "DETALHES: SIGLA: UPGN Cabiúnas <br>OPERADOR: Transpetro (Petrobras) <br> TIPO: Unidade de Produção de Gás<br><br> MUNICÍPIO: Macaé (RJ)<br><br> FONTE: Petrobras 2015<br><br>TIPO: Unidade de Produção de Gás", "CLASSE": "PETRÓLEO E GÁS", "fillColor": "#FFA500", "Simbolo": "cross" }, "geometry": { "type": "Point", "coordinates": [ -41.72051, -22.285425, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Centro de Tratamento e Disposição de Resíduos Sólidos", "PopupInfo": "DETALHES: OBSERVAÇÃO: Localização possível para implantação do centro de tratamento<br>TIPO: Outros<br><br>MUNICÍPIO: Caraguatatuba<br><br> ELABORAÇÃO: Instituto Pólis 2015 <br> FONTE: Plano Municipal de Gestão Integrada de Resíduos Sólidos de Caraguatat", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -45.454946, -23.629922, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Saipen - Centro de Tecnologia e Construção Offshore", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Petróleo e Gás<br><br>MUNICÍPIO: Guarujá<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo'<br><br>TIPO: Petróleo e gás", "CLASSE": "OUTROS", "fillColor": "#FFA500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.293077, -23.993002, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Complexo Empresarial Andaraguá", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Imobiliário<br><br>MUNICÍPIO: Praia Grande<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Imobiliário", "CLASSE": "OUTROS", "fillColor": "#20B2AA", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.503368, -24.003749, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Reforma do Estádio de Guarujá", "PopupInfo": "DETALHES: TIPO: Outro<br><br>MUNICÍPIO: Guarujá<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Outro", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.271416, -23.997879, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Expansão da Riviera", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Imobiliário<br><br>MUNICÍPIO: Bertioga<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Imobiliário", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.022973, -23.799468, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Guaratuba Resort", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Imobiliário<br><br>MUNICÍPIO: Bertioga<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Imobiliário", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -45.941999, -23.770979, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Jardim Samambaia", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Rodoviário<br><br>MUNICÍPIO: Praia Grande<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Rodoviário", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.559511, -24.061197, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Dow Química", "PopupInfo": "DETALHES: TIPO: Industrial<br><br>MUNICÍPIO: Guarujá<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Industrial", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.283679, -23.979464, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Conjunto Habitacional (1.000 UH)", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Imobiliário<br><br>MUNICÍPIO: Praia Grande<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Imobiliário", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.439446, -23.995186, 0.0 ] } },
{ "type": "Feature", "properties": { "Name": "Piscinões do bairro Vila São Jorge dos Erasmos", "PopupInfo": "DETALHES: OBSERVAÇÃO: Indicação da localização aproximada<br>TIPO: Outro<br><br>MUNICÍPIO: São Vicente<br><br>FONTE: Câmara Temática 'Diálogo sobre Grandes Empreendimentos no Litoral de São Paulo' <br><br>TIPO: Outro", "CLASSE": "OUTROS", "fillColor": "#FF4500", "Simbolo": "square" }, "geometry": { "type": "Point", "coordinates": [ -46.364156, -23.947442, 0.0 ] } }
]
}
 ]
        , {

            style: function (feature) {
                return feature.properties && feature.properties;
            },

onEachFeature: onEachFeature
,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);



});