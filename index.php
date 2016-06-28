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
ini_set('display_errors', '1');     # don't show any errors...
error_reporting(E_ALL | E_STRICT);  # ...but do log them
/**
 * Diarissíma app class
 * @author dvinciguerra / renato cron
 */
function curl_get_contents($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_URL, API_URL . $url);

    $data = curl_exec($ch);

    if ($data===false){
        echo(curl_error($ch));
        exit;
    }

    curl_close($ch);

    return $data;
}
class Polis {

  public function run(){
    $r = new RouteCollector();

    // home index action
    $r->get('/', function(){

        $acoes =json_decode( curl_get_contents(  "/polis/acoes"))->{'acoes'};

        foreach ($acoes as $a){
            $a->text_content = json_decode($a->text_content);
        }
        echo self::render('/home/index.php', [  'acoes' => $acoes  ]);
    });

    $r->get('acao/{id}', function($id){
        $acao =json_decode( curl_get_contents(  "/polis/acoes_item/$id"));
        $acao->text_content = json_decode($acao->text_content);
        echo self::render('/home/acao.php', [ 'acao' => $acao]);
    });


    $r->get('ajax/pesquisa-acao', function(){
        echo(( curl_get_contents(  "/polis/acoes_search_get_ids?q=". urlencode( @$_GET['q']) )));
        exit;
    });

    // setting dispatcher
    $dispatcher =  new Dispatcher($r->getData());
    $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
  }

  /**
   * render templates method
   */
  public static function render($tmpl, $stash){
    $template = new Engine($GLOBALS['TMPL_DIR']);
    return $template->render($tmpl, $stash);
  }
}

(new Polis())->run();
