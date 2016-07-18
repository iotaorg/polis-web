<?php
// include autoload
include __DIR__ . '/vendor/autoload.php';

// import classes
use Phroute\Phroute\RouteCollector;
use Phroute\Phroute\Dispatcher;
use Ark\Template\Engine;

// configuration
$GLOBALS['TMPL_DIR'] = __DIR__ . '/templates';
include __DIR__ . '/config.php';

ini_set('display_errors', '1');
error_reporting(E_ALL | E_STRICT);

/**
 * Diarissíma app class
 * @author dvinciguerra / renato cron
 */
function my_file_get_contents($url)
{
    $test = @file_get_contents(API_URL . $url);

    if (!$test){
        print "<center><h1>Problemas de conexão com a API... <br/><br/>Tente novamente em alguns segundos</h1></center>";
        exit;
    }
    return $test;
}
function make_menu()
{
    $menu = json_decode(my_file_get_contents("/polis/menus"))->{'menus'};
    $ref_menu  = new StdClass;

    foreach ($menu as $v ){
        $ref_menu->{$v->id} = $v;
    }

    $out = [];
    foreach ($menu as $v ){
        if($v->menu_id && !empty($ref_menu->{$v->menu_id}) ){
            if ( empty($ref_menu->{$v->menu_id}->{'subs'})){
                $ref_menu->{$v->menu_id}->{'subs'} = [];
            }
            $ref_menu->{$v->menu_id}->{'subs'}[] = $v;
        }else if(!$v->menu_id){
            $out[] = $v;
        }
    }

    return $out;
}

class Polis
{
    public

    function run()
    {
        $r = new RouteCollector();

        /* lista de acoes */
        $r->get('/', function () {
            $menus = make_menu();
            $acoes = json_decode(my_file_get_contents("/polis/acoes"))->{'acoes'};
            foreach($acoes as $a) {
                $a->text_content = json_decode($a->text_content);
            }

            echo self::render('/home/index.php', ['acoes' => $acoes, 'menus' => $menus]);
        });

        /* pagina acao */
        $r->get('acao/{id}', function ($id) {
            $menus = make_menu();
            $acao = json_decode(my_file_get_contents("/polis/acoes_item/$id"));
            $acao->text_content = json_decode($acao->text_content);
            $indicadores = json_decode(my_file_get_contents("/polis/indicadores_acao/" . $acao->id))->{'indicators'};
            echo self::render('/home/acao.php', ['acao' => $acao, 'menus' => $menus, 'indicadores' => $indicadores]);
        });

        /* pagina pagina */
        $r->get('pagina/{id}', function ($id) {
            $menus = make_menu();
            $pagina = json_decode(my_file_get_contents("/polis/pagina/$id"))->{'page'};

            echo self::render('/home/pagina.php', ['pagina' => $pagina, 'menus' => $menus ]);
        });

        /* tabela */
        $r->get('ajax/indicador_tabela_rot_regiao',  function () {

            $variable_type = @$_GET['variable_type'] == 'str' ? 'indicador_tabela_rot_txt' : 'indicador_tabela_rot_regiao';

            $valores = my_file_get_contents("/polis/$variable_type/" . urlencode(@$_GET['id']));
            echo self::render("/segment/$variable_type.php", ['dados' => json_decode($valores), 'json' => $valores, 'js' => @$_GET['js'] ]);
        });

        /* ajax pesquisa */
        $r->get('ajax/pesquisa-acao', function () {
            echo ((my_file_get_contents("/polis/acoes_search_get_ids?q=" . urlencode(@$_GET['q']))));
            exit;
        });

        // setting dispatcher
        $dispatcher = new Dispatcher($r->getData());
        $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    }

    /**
     * render templates method
     */
    public static

    function render($tmpl, $stash)
    {
        $template = new Engine($GLOBALS['TMPL_DIR']);
        return $template->render($tmpl, $stash);
    }
}

(new Polis())->run();
