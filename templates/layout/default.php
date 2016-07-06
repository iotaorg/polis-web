<!DOCTYPE html>
<html lang="pt-br">
<head>
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
    <link href="/static2/css/font-awesome.css" rel="stylesheet">
    <link href="/static2/css/bootstrap-social.css" rel="stylesheet">


    <link href="/static2/css/style.css?v=12" rel="stylesheet">
    <link href="/static2/css/home_style.css?v=12" rel="stylesheet">

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
                        <a href="/">Home</a>
                    </li>
                    <li class="page-scroll">
                        <a href="/sobre">Sobre</a>
                    </li>
                    <li class="page-scroll">
                        <a href="http://litoralsustentavel.org.br/agenda-de-desenvolvimento-sustentavel/">Agendas</a>
                    </li>
                    <li class="page-scroll">
                        <a href="http://litoralsustentavel.org.br/contato/">Contato</a>
                    </li>
                </ul>
                <ul class="menu menu-social">
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
    <a href="/"><img src="/static2/css/images/logo-monitoramento-branco.svg" border="0"></a>
    <div class="navbar-menu collapse">
        <ul>
            <li class="page-scroll">
                <a href="/sobre">Sobre</a>
            </li>
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
            <div class="mapa-do-site col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div class="mapa-s-title">
                    <h2>MAPA DO SITE</h2>
                </div>
                <div class="mapa-site-content">
                    <ul class="m-s-ul">
                        <li class="m-s-li-principal">
                            <a href="#">SOBRE</a>
                            <ul>
                                <li>
                                    <a href="#">Sobre</a>
                                </li>
                            </ul>
                        </li>
                        <li class="m-s-li-principal">
                            <a href="http://litoralsustentavel.org.br/agenda-de-desenvolvimento-sustentavel/">AGENDAS</a>
                            <ul>
                                <li>Sobre</li>
                            </ul>
                        </li>
                        <li class="m-s-li-principal">
                            <a href="http://litoralsustentavel.org.br/contato/">CONTATO</a>
                            <ul>
                                <li>
                                   XXX
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="apoio-wrap col-lg-8 col-md-8 col-sm-8 col-xs-12">
                <div style="background-color: white; overflow:auto">
                    <a title="Ir para Petrobras" target="_blank" class="a-block" href="http://www.petrobras.com.br/pt/">
                        <img src="/static2/css/images/petrobras-logo.png" style="width: 100%;"/>
                    </a>
                </div>

                <div style=" background-color: white; overflow:auto;">
                    <a title="Ir para Polis" target="_blank" class="a-block" href="http://polis.org.br/">
                        <img style=" padding: 15px" src="/static2/css/images/logo_polis_invertido.png" />
                    </a>

                    <a title="Ir para Litoral Sustentavel" target="_blank" class="a-block" href="http://litoralsustentavel.org.br/" >
                        <img alt="Logo Observatório Litoral Sustentável" src="/static2/css/images/logo-obs-preto.png" style="width: 325px"/>
                    </a>
                </div>

                <div style="overflow:auto; text-align: right">
                    <a style="display:inline-block; width: 49%;" href="http://www.brasil.gov.br/" target="_blank" >
                        <img src="/static2/css/images/governo-federal-Temer.jpg" style="max-width: 100%; margin-top: 5px">
                    </a>
                    <a style="display:inline-block; width: 50%"  title="Ir para Iota" target="_blank" href="https://github.com/eokoe/Iota">
                        <img style="max-width: 40%; margin-right: 30%" alt="Logo do sistema IOTA" src="/static2/css/images/iota-negativo.svg" >
                    </a>
                </div>


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
            <div class="cc-wrap col-lg-4 col-md-4 col-sm-4 col-xs-12">Alguns direitos reservados <img src="/static2/css/images/cc.png"></div>
        </div>
    </div>
</footer>


    <?php $this->block('footer');?>

    <!-- Core JavaScript Files -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script async src="/static2/js/jquery.easing.1.3.js"></script>
    <script async src="/static2/js/bootstrap.min.js"></script>
    <script async src="/static2/js/site.js?v=6"></script>
    <script src="/static2/js/jquery.flot.min.js"></script>

    <!-- javascript -->
    <?php $this->block('scripts');?>

  </body>
</html>
