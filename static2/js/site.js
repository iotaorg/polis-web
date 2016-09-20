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
        _click_to_filter = function(event) {
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
                vt = $self.attr('data-variable-type'),
                tp = $self.attr('data-template'),
                gt = $self.attr('data-graph-type');

            $.ajax({
                url: '/ajax/indicador_tabela_rot_regiao',
                data: {
                    id: id,
                    variable_type: vt,
                    js: 1,
                    template_name: tp
                },
                dataType: "html",
            }).success(function(e) {
                $self.find('.table').html(e);

                if (!(vt === 'str')) {

                    var elm = $self.find('div[data-json]');

                    _carrega_flot_graph($self, {
                        type: gt,
                        data: $.parseJSON(elm.attr('data-json'))
                    });

                }
                if ((vt === 'str' && gt == 'pie')) {

                    var elm = $self.find('div[data-json]'),
                        mod_data = $.parseJSON(elm.attr('data-json'));

                    /* lines serao as variaveis, e os headers os dados para a pizza */
                    var new_lines = mod_data.headers,
                        new_headers = [],
                        variable_ref = {},
                        variable_dist = {};
                    // corre cada variaval, para criar uma lista com cada valor encontrado em cada cidade
                    $.each(mod_data.headers, function(i, header) {

                        variable_dist[header.k] = {};
                        variable_ref[header.k] = header.name;

                        // procura por cada cidade existente
                        $.each(mod_data.lines, function(i, row) {

                            var val = typeof mod_data.data[row.k] == 'undefined' ? '(em branco)' : mod_data.data[row.k][header.k];

                            if (typeof variable_dist[header.k][val] == 'number') {
                                variable_dist[header.k][val]++;
                            } else {
                                variable_dist[header.k][val] = 1;
                            }
                        })
                    });

                    var used = {};
                    $.each(variable_dist, function(i, vt) {
                        $.each(vt, function(i, fn) {
                            if (!used[i]) {
                                new_headers.push({
                                    k: i,
                                    v: i,
                                    title: variable_ref[i]
                                });
                                used[i] = 1;
                            }
                        });
                    });

                    _carrega_flot_graph($self, {
                        type: gt,
                        data: {
                            lines: new_lines,
                            headers: new_headers,
                            data: variable_dist,
                            indicator: mod_data.indicator
                        },
                        no_reverse: 1,
                        use_title: 1,
                        variable_colors: mod_data.variable_colors
                    });

                }

            }).error(function() {
                $self.find('.table').html('Ocorreu um erro ao carregar os dados...');
            });

        },
        __colors = [
            "#edc240", "#afd8f8", "#cb4b4b", "#FFA500", "#af70f1", "#cdb466", "#a9c1d4", "#a23c3c", "#6da36d",
            "#7633bd", "#ffe84c", "#A9A9A9", "#f35a5a", "#5cc85c", "#b14cff", "#aa965b", "#ef58a2", "#6691b8",
            "#d1370d", "#455d2c", "#a30540", "#53776e"
        ],
        __prefered_colors = {
            351: '#cdb466',
            35054: '#a9c1d4',
            35063: '#a23c3c',
            3506359: '#af70f1',
            3518701: '#6da36d',
            3548500: '#edc240',
            3531100: '#7633bd',
            3522109: '#ffe84c',
            3551009: '#cb4b4b',
            3537602: '#A9A9A9',
            3513504: '#f35a5a',
            3555406: '#FFA500',
            3510500: '#5cc85c',
            3520400: '#afd8f8',
            3550704: '#ef58a2',
            3541000: '#6691b8',
        },
        get_color_for = function(i, pref_id) {
            if (typeof __prefered_colors[pref_id] == 'string') return __prefered_colors[pref_id];
            return __colors[i] || i;
        },
        _carrega_flot_graph = function($where, graph_opt) {
            $where = $where.find('.graph').html('');

            if (graph_opt.type == 'line' || !graph_opt.type) {
                _graph_lines($where, graph_opt);
            } else {
                _graph_yearly($where, graph_opt);
            }
        },
        labelFormatter = function(label, series) {
            return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
        },
        fix_prefered_colors = function(color) {
            if (color == '#E2F98E') color = '#ffc107';
            return color;
        },
        _graph_yearly = function($where, graph_opt) {

            id_seq++;
            var $opts_container = $where.append('<div style="float:right; font-size: 0.8em" class="a col-xs-12 ' + (graph_opt.type == 'pie' ? 'col-sm-2' : 'col-sm-1') + ' form-group"></div>').find('.a'),
                graph = graph_opt.data;

            $.each(graph.lines, function(key, val) {
                $opts_container.append("<div class='radio' " + (val.name ? ('title="' + val.name + '"') : '') + "><label><input type='radio' name='rd" + id_seq + "' value='" + val.k +
                    "'></input>" + val.v + "</label></div>");
            });

            if (graph_opt.use_title) {
                $opts_container.parent().append('<div class="graph-title"></div>');
            }

            var $graph_div = $opts_container.parent().append('<div style="float:left; min-height: 500px" class="b col-xs-12 ' + (graph_opt.type == 'pie' ? 'col-sm-10' : 'col-sm-11') + '"></div>').find('.b');

            var prepend_to_result = graph.indicator.prepend_on_result,
                append_to_result = graph.indicator.append_on_result;

            $opts_container.find('input').on('change', function() {
                if (!this.checked) return false;

                var current_year = graph.data[this.value],
                    headers_array = [],
                    prefer_colors = graph_opt.variable_colors ? graph_opt.variable_colors[this.value] : 0;


                if (graph_opt.use_title) {
                    $opts_container.parent().find('.graph-title').text($(this).parents('div.radio:first').attr('title'));
                }

                var datasets = [];

                $.each(graph.headers, function(i, region) {
                    headers_array.push([i, region.v]);


                    datasets.push({
                        data: [
                            [i, current_year[region.k] * 1]
                        ],
                        label: region.v,
                        color: typeof prefer_colors[region.v] == 'string' ? fix_prefered_colors(prefer_colors[region.v]) : get_color_for(i, region.k)
                    });

                });

                var conf = {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                threshold: 0.02,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 1
                                }
                            }
                        },
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            lineWidth: 2,
                            fill: .75
                        }
                    },
                    conf_name = (graph_opt.type == 'pie' ? 'pie' : 'bars'),
                    final_conf = {};
                final_conf[conf_name] = conf[conf_name];

                var plot = $.plot($graph_div, datasets, {
                    yaxis: {
                        autoscaleMargin: 0.5,
                        tickFormatter: function(v) {
                            return (prepend_to_result ? '<sub>' + prepend_to_result + '</sub> ' : '') +
                                (v.toLocaleString ? v.toLocaleString() : v) +
                                (append_to_result ? ' ' + '<sup>' + append_to_result + '</sup>' : '');
                        },
                    },
                    grid: {
                        hoverable: true
                    },
                    series: final_conf,
                    tooltip: true,
                    xaxis: {
                        ticks: headers_array
                    },
                    legend: {
                        show: false
                    }
                });


                $graph_div.attr('id', 'id_' + id_seq++);
                $('#' + $graph_div.attr('id')).bind("plothover", function(event, pos, item) {

                    if (item) {
                        if (typeof item.datapoint[1] == 'object') {
                            item.datapoint[1] = item.datapoint[1][0][1];
                        }

                        var y = (prepend_to_result ? prepend_to_result + ' ' : '') +
                            (item.datapoint[1].toLocaleString ? item.datapoint[1].toLocaleString() : item.datapoint[1]) +
                            (append_to_result ? ' ' + '<sup>' + append_to_result + '</sup>' : '');

                        $("#tooltip").html(graph.headers[item.seriesIndex].v + " = " + y)
                            .css({
                                top: pos.pageY - 28,
                                left: pos.pageX + 5
                            })
                            .fadeIn(200);

                    } else {
                        $("#tooltip").hide();
                    }

                });

                if (graph_opt.type == 'bar') {


                    if (!$graph_div.parents('.tab-content:first').hasClass('tab-content-bar')) {
                        $graph_div.parents('.tab-content:first').addClass('tab-content-bar');
                        $graph_div.parents('.tab-content:first').height(($graph_div.parents('.tab-content:first').height() + 90) + 'px')
                    }
                }

            });

            $opts_container.find('input:first').prop('checked', true);

            // inverte a ordem das divs de uma maneira que deve ser muito eficiente! # SQN
            if (!graph_opt.no_reverse) {
                $opts_container.children().each(function(i, li) {
                    $opts_container.prepend(li)
                });
            }
            $opts_container.find('input:checked').change();
            setTimeout(function() {
                // clica no selecionado para disparar o draw do grafico
                $opts_container.find('input:checked').change();
            }, 0);

            $(window).bind('resize', debounce(function() {
                $opts_container.find('input:checked').change();
            }, 100))

        },
        _graph_lines = function($where, graph_opt) {


            var datasets = {},
                graph = graph_opt.data;

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
                val.color = get_color_for(i, key);
                ++i;
            });

            // insert checkboxes
            var $opts_container = $where.append('<div style="float:right; font-size: 0.8em" class="a  col-xs-12 col-sm-2 form-group"></div>').find('.a');

            $.each(graph.headers, function(key, val) {
                var checked = /Litoral Sustentável|Baixada Santista|Litoral Norte/.test(val.v) ? '' : "checked='checked'";
                $opts_container.append("<div class='checkbox'><label><input type='checkbox' name='" + val.k +
                    "' " + checked + "></input>" + val.v + "</label></div>");
            });

            var $graph_div = $opts_container.parent().append('<div style="float:left; min-height: 500px" class="b col-xs-12 col-sm-10"></div>').find('.b');
            $opts_container.find("input").click(plotAccordingToChoices);



            var prepend_to_result = graph.indicator.prepend_on_result,
                append_to_result = graph.indicator.append_on_result;

            function plotAccordingToChoices() {

                var data = [];

                $opts_container.find("input:checked").each(function() {
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
                                y = (prepend_to_result ? prepend_to_result + ' ' : '') +
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



        };

    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #1c72ca",
        "font-weight": "700",
        padding: "3px",
        color: "white",
        "background-color": "#6fa7e0"
    }).appendTo("body");
    $indicadores.each(function(i, e) {

        _carrega_tabela_indicador(e);
    })

    /* fim indicadores */

    $('li[role=presentation]').on('click', function() {
        $('#tooltip').hide();
    });

});

jQuery(window).load(function() {
    setTimeout(function() {
        jQuery('iframe[data-src]').each(function(i, e) {
            jQuery(e).attr('src', jQuery(e).attr('data-src'));
        });
    }, 500);
});