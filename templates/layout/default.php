<!DOCTYPE html>
<html lang="pt-br">
<head><?$version='134'?>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow, noarchive">

    <title><?php $this->block('title');?></title>

    <!-- Bootstrap Core CSS
    <link href="/static2/css/bootstrap.min.css" rel="stylesheet">
-->
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet" type="text/css">

    <!-- Custom CSS -->
    <link href="/static2/css/font-awesome.css?v=1" rel="stylesheet">
    <link href="/static2/css/bootstrap-social.css" rel="stylesheet">

    <link href="/static2/css/style.css?v=<?=$version?>" rel="stylesheet">

    <!-- Custom Favicon -->
    <link rel="icon" href="/static2/favicon.ico?v=1.1">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!--[if lte IE 8]><script language="javascript" type="text/javascript" src="/static2/js/excanvas.min.js"></script><![endif]-->
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,300,900,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <noscript><style> .jsonly { display: none } </style></noscript>
</head>
<body id="page-top" class="index">

<section class="menu-top hidden-xs">
    <div class="container">
        <div class="row">
                <ul class="menu menu-texto">
                    <li class="page-scroll">
                        <a href="/">Início</a>
                    </li>
<?php $this->begin('menu');?>
<?foreach ($menus as $v):?>
    <?if (!empty($v->subs)):?>
    <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?=$v->title?> <span class="caret"></span></a>

        <ul class="dropdown-menu">
            <?foreach ($v->subs as $s):?>
                <li>
                    <a href="/pagina/<?=$s->page->title_url?>">〉<?=$s->page->title?></a>
                </li>
            <?endforeach?>
        </ul>

    </li>
    <?elseif ($v->page):?>
    <li class="page-scroll">
        <a href="/pagina/<?=$v->page->title_url?>"><?=$v->title?></a>
    </li>
    <?endif?>
<?endforeach?>
<?php $this->end();?>
        <li class="page-scroll">
            <a href="http://litoralsustentavel.org.br/agenda-de-desenvolvimento-sustentavel/">Agendas</a>
        </li>
        <li class="page-scroll">
            <a href="http://litoralsustentavel.org.br/contato/">Contato</a>
        </li>
    </ul>
    <ul class="menu menu-social">
        <li>
            <a href="/frontend/admin" style="opacity:0.3;font-size: 10px">admin</a>
        </li>
        <li>
            <a href="https://www.facebook.com/litoralsustentavel/" title="Facebook"><i class="fa fa-facebook"></i></a>
        </li>
        <li>
            <a href="https://twitter.com/observalitoral" title="Twitter" ><i class="fa fa-twitter"></i></a>
        </li>
        <li>
            <a href="https://www.youtube.com/litoralsustentavel" title="Youtube" ><i class="fa fa-youtube-play"></i></a>
        </li>
    </ul>
        </div>
    </div>
</section>

<nav class="nav-top visible-xs">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-menu">
        <i class="fa fa-bars"></i>
    </button>
    <a href="/"><img src="/static2/css/images/logo-monitoramento-branco.svg?v=5" border="0"></a>
    <div class="navbar-menu collapse">
        <ul>
            <?php $this->block('menu');?>
            <li class="page-scroll">
                <a href="http://litoralsustentavel.org.br/agenda-de-desenvolvimento-sustentavel/">Agendas</a>
            </li>
            <li class="page-scroll">
                <a href="http://litoralsustentavel.org.br/contato/">Contato</a>
            </li>
        </ul>
    </div>
</nav>
<?php $this->begin('content');?><?php $this->end();?>

<footer class="footer-principal">
    <div class="container">
        <div class="row">
            <div class="mapa-do-site col-md-4" style="background-color: rgba(255,255,255,0.1);padding: 9px;">
                <div class="mapa-s-title">
                    <h2>MAPA DO SITE</h2>
                </div>
                <div class="mapa-site-content">
                    <ul class="m-s-ul">

                        <li class="m-s-li-principal">
                            <span>Litoral Sustentável</span>
                            <ul>
                                <li><a target="_blank" href="http://litoralsustentavel.org.br/agenda-de-desenvolvimento-sustentavel/">Agenda de desenvolvimento sustentável</a></li>
                                <li><a target="_blank" href="http://litoralsustentavel.org.br/contato/">Contato</a></li>
                            </ul>
                        </li>

                        <li class="m-s-li-principal">
                            <span>Polis</span>
                            <ul>
                                <li><a target="_blank" href="http://polis.org.br/institucional/#page_o-que-e-o-polis">O que é</a></li>
                                <li><a target="_blank" href="http://polis.org.br/contato/">Contato</a></li>
                            </ul>
                        </li>

                        <li class="m-s-li-principal">
                            <span>Iota</span>
                            <ul>
                                <li><a target="_blank" href="http://eokoe.github.io/Iota/">O que é</a></li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
            <div class="apoio-wrap col-md-5 col-sm-7 col-xs-12" style="background-color: rgba(255,255,255,0.1);padding: 82px;text-align: center;min-height: 269px;">
                <a title="Ir para Litoral Sustentavel" target="_blank" class="a-block" href="http://litoralsustentavel.org.br/" >
                    <img alt="Logo Observatório Litoral Sustentável" src="/static2/css/images/logo-obs-preto.png" style="width: 325px;max-width:100%"/>
                </a>
            </div>
            <div class="apoio-wrap col-md-3 col-sm-5 col-xs-12 text-right logos-alinhados" style="background-color: rgba(255,255,255,0.1);padding: 0;">
                <img src="/static2/css/images/logos-juntos.jpg" style="height: 270px"/>
            </div>
        </div>
    </div>
</footer>
<footer class="footer-creditos">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                <h2>Observatório Litoral Sustentável</h2>
                <p>Pólis - Instituto de Estudos, Formação e Assessoria em Políticas Sociais. Rua Araújo 124, São Paulo - SP observatorio@litoralsustentavel.org.br</p>
                <p>55 11 2174 6800</p>
            </div>

            <div class="cc-wrap col-lg-4 col-md-4 col-sm-4 col-xs-12">
                Plataforma de Indicadores <a title="Ir para Iota" target="_blank" href="http://eokoe.github.io/Iota/">
                    <img style="height: 30px; margin-top: -8px" alt="Logo do sistema IOTA" src="/static2/css/images/iota-negativo.svg" >
                </a><br/>
                Alguns direitos reservados <img src="/static2/css/images/cc.png">
            </div>
        </div>
    </div>
</footer>


    <?php $this->block('footer');?>

    <!-- Core JavaScript Files -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script async src="/static2/js/jquery.easing.1.3.js"></script>
    <script async src="/static2/js/bootstrap.min.js"></script>

    <script async src="/static2/js/site.js?v=<?=$version?>"></script>
    <script src="/static2/js/jquery.flot.min.js"></script>
    <script src="/static2/js/jquery.flot.pie.min.js"></script>

    <!-- javascript -->
    <?php $this->block('scripts');?>

  </body>
</html>
