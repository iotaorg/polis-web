<?php $this->extend('layout/default.php');?>

<!-- page-title -->
<?php $this->begin('title');?>
  Litoral Sustentavel
<?php $this->end();?>


<?php $this->begin('content');?>

<a id="home" class="anchor"></a>
    <section class="home text-center">
        <div class="container">
            <div class="col-sm-12">
                <div class="home-logo-wraper hidden-xs"><img src="/static2/css/images/logo-monitoramento-branco.svg?v=1"></div>

            </div><!-- div.col-sm-12-->
            <div class="eixos-wrap col-lg-12 col-md-12 col-sm-12">
                    <section class="eixo-wrap col-lg-4 col-md-4 col-sm-12">
                            <div class="eixo-esq">
                                <div class="faixa-b"></div>
                            </div>
                            <div class="eixo-centr"><img src="/static2/css/images/icone-eixo1.png"></div>
                            <div class="eixo-dir">
                                <div class="faixa-b"></div>
                            </div>
                            <div class="eixo-txt">
                                <span class="eixo-title">EIXO 1</span>
                                <p class="eixo-paragrafo">DESENVOLVIMENTO SUSTENTAVEL E ENVOLVENTE</p>
                            </div>
                    </section>
                    <section class="eixo-wrap col-lg-4 col-md-4 col-sm-12">
                        <div class="eixo-esq">
                            <div class="faixa-b"></div>
                        </div>
                        <div class="eixo-centr"><img src="/static2/css/images/icone-eixo2.png"></div>
                        <div class="eixo-dir">
                            <div class="faixa-b"></div>
                        </div>
                        <div class="eixo-txt">
                            <span class="eixo-title">EIXO 2</span>
                            <p class="eixo-paragrafo">USO SUSTENTAVEL DAS AREAS PROTEGIDAS</p>
                        </div>
                    </section>
                    <section class=" eixo-wrap col-lg-4 col-md-4 col-sm-12">
                        <div class="eixo-esq">
                            <div class="faixa-b"></div>
                        </div>
                        <div class="eixo-centr"><img src="/static2/css/images/icone-eixo3.png"></div>
                        <div class="eixo-dir">
                            <div class="faixa-b"></div>
                        </div>
                        <div class="eixo-txt">
                            <span class="eixo-title">EIXO 3</span>
                            <p class="eixo-paragrafo">DEMOCARTIZAÇÃO DO TERIITÓRIO E INCLUSÃO SOCIAL</p>
                        </div>
                    </section>
            </div>
        </div><!-- div.container-->
        <!-- <div class="convexo-home">&nbsp;</div> -->
    </section>


    <section class="acoes">
            <section class="acoes-header">


                <div class="container">

                 <h2>AÇÔES</h2>

                    <section class="filtros-eixos-wrap">
                        <form id="busca_acoes" class="busca-acoes">
                            <div class="input-group add-on">
                                <input name="srch-term" type="search" class="form-control" placeholder="Buscar ações...">
                                <div class="input-group-btn">
                                    <button class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                                </div>
                            </div>
                        </form>

                    </section>

                </div>

            </section>
            <div class="container">


                <section class="acoes-list-wrap">
                    <?php foreach (  $acoes as $a ): ?>
                    <div class="acao-wrap col-lg-3 col-md-3 col-sm-4 col-xs-12">
                        <div class="acao-sub-wrap"><a class="linkacao" href="/acao/<?= $a->name_url?>">
                            <div class="acao-img-wrap" style="background-image: url(<?= $a->text_content->url_rede_low?>); background-size:cover; height: 255px">
                            </div>
                            <div style="position:relative">
                                <div class="acao-txt-wrap">
                                    <div class="row">
                                        <img src="/static2/images/eixo<?= preg_replace('/[^0-9]*/', '', $a->axis_name)?>.png" class="col-lg-3 col-md-4 col-sm-4 col-xs-4">
                                        <span class="col-lg-9 col-md-8 col-sm-8 col-xs-8 acao-txt"><?= $a->name?></span>
                                    </div>
                                </div>
                            </div>
                      </a>  </div>
                    </div>
                  <?php endforeach ?>

                    </div>
                </section>

            </div>
            <section class="acoes-footer">
                <img src="/static2/css/images/fundo-content-bottom.png">
            </section>
    </section>


<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
