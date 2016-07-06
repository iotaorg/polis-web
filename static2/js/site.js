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
        _click_to_filter = function() {
            var $me = $(this);
            $search.val('eixo ' + $me.attr('data-eixo')).trigger('keyup');
        };
    $eixo_wrap.on('click', _click_to_filter);
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
            $where.find('.graph').html(graph);

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


});