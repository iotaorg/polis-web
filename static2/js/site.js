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
            var target = $('.filtros-eixos-wrap');

            if (target.length) {
                event.preventDefault();

                if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
                    window.setTimeout(function() {
                        window.scrollTo(0, target.offset().top - 69)
                    }, 0);
                } else {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 69
                    }, 500);
                }
            }
        };
    $eixo_wrap.on('click', _click_to_filter);
    // ativa o eixo caso venha no parametro
    if (eixo_num)
        $eixo_wrap.filter('[data-eixo="' + eixo_num + '"]').click();

    /* fianl filtro pelo eixo*/

    /* carregar dados indicadores */

    var id_seq = 0,
        $indicadores = $('.tab-indicador'),
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
            var choiceContainer = $where.append('<div style="float:right; font-size: 0.8em" class="a  col-xs-12 col-sm-2 form-group"></div>').find('.a');

            $.each(datasets, function(key, val) {
                choiceContainer.append("<div class='checkbox'><label><input type='checkbox' name='" + key +
                    "' checked='checked'></input>" + val.label + "</label></div>");
            });

            var $graph_div = choiceContainer.parent().append('<div style="float:left; min-height: 500px" class="b col-xs-12 col-sm-10"></div>').find('.b');
            choiceContainer.find("input").click(plotAccordingToChoices);

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #1c72ca",
                "font-weight": "700",
                padding: "3px",
                color: "white",
                "background-color": "#6fa7e0"
            }).appendTo("body");


            var prepend_to_result = graph.indicator.prepend_on_result,
                append_to_result = graph.indicator.append_on_result;

            function plotAccordingToChoices() {

                var data = [];

                choiceContainer.find("input:checked").each(function() {
                    var key = $(this).attr("name");
                    if (key && datasets[key]) {
                        data.push(datasets[key]);
                    }
                });

                if (data.length > 0) {
                    $graph_div.attr('id', 'id_' + id_seq++);

                    var plot = $.plot($graph_div, data, {
                        yaxis: {
                            autoscaleMargin: 0.5,
                            tickFormatter: function(v) {
                                return (prepend_to_result ? '<sub>' + prepend_to_result + '</sub> ' : '') +
                                       (v.toLocaleString ? v.toLocaleString() : v) +
                                       (append_to_result ? ' ' + '<sup>' + append_to_result + '</sup>' : '');
                            },
                        },
                        series: {
                            lines: {
                                show: true
                            },
                            points: {
                                show: true
                            }
                        },
                        grid: {
                            hoverable: true
                        },
                        legend: {
                            noColumns: 2
                        },
                        xaxis: {
                            tickDecimals: 0
                        }
                    });

                    $('#' + $graph_div.attr('id')).bind("plothover", function(event, pos, item) {

                        if (item) {
                            var x = item.datapoint[0],
                                y = (prepend_to_result ?  prepend_to_result + ' ' : '') +
                                       (item.datapoint[1].toLocaleString ? item.datapoint[1].toLocaleString() : item.datapoint[1]) +
                                       (append_to_result ? ' ' + '<sup>' + append_to_result + '</sup>' : '');

                            $("#tooltip").html(item.series.label + " = " + y)
                                .css({
                                    top: item.pageY - 28,
                                    left: item.pageX + 5
                                })
                                .fadeIn(200);
                        } else {
                            $("#tooltip").hide();
                        }

                    });

                }

            }

            plotAccordingToChoices();

            $(window).bind('resize', debounce(function() {
                plotAccordingToChoices();
            }, 100))

            //$search.on('keyup', debounce(_ajax_acoes, 150));

        };

    $indicadores.each(function(i, e) {
        _carrega_tabela_indicador(e)
    })

    /* fim indicadores */




});