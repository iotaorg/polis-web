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
                }).done(function() {
                    _filter_acoes(acoes, true);
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

});