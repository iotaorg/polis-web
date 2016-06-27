<?php $this->extend('layout/default.php');?>

<!-- page-title -->
<?php $this->begin('title');?>
  Ação <?=$acao->name?>
<?php $this->end();?>


<?php $this->begin('content');?>

<section class="home acao-home acao-eixo<?= preg_replace('/[^0-9]*/', '', $acao->axis_name)?>">
    <div class="container">
        <div class="acao-header-title-wrap">
            <header class="acao-header-title">
                <img src="/static2/images/eixo<?= preg_replace('/[^0-9]*/', '', $acao->axis_name)?>.png" alt="Icone para <?= $acao->axis_name ?>">
                <?=$acao->name?>
            </header>
            <div class="acao-header-txt">
                <?=$acao->description?>
            </div>
        </div>
    </div>
</section>

<div class="acao-content-wrap">
    <div class="container">

        <? if ($acao->text_content->txt_titulo_mapa):?>
        <div class="mapa-acao-wrap">
            <h3 class="titulo-mapa"><?= $acao->text_content->txt_titulo_mapa?></h3>
            <h4 class="descricao-mapa"><?= $acao->text_content->txt_descricao_mapa?></h4>
            <div class="row">
            <div class="col-lg-12 col-md-12">
            <div class="embed-responsive embed-responsive-3by4">
            <div class="embed-responsive embed-responsive-3by4">
            mapa lento vinha aqui...
            </div>
            </div>
            </div>
            </div>
        </div>
        <?endif?>


        <div class="acao-acordeon">
            <div aria-multiselectable="true" class="panel-group" id="accordion-acao" role="tablist">
                <?php foreach ( array (
                    "txt_info_qualitativas" => 'Informações qualitativas',
                    "txt_condicionantes"    => 'Condicionantes ambientais',
                    "txt_focos"             => "Focos e Perguntas Orientadoras",
                ) as $key => $value ): if ( $acao->text_content->$key == '' ) continue ?>
                    <div class="panel panel-default">
                        <div class="panel-heading" id="headingOne" role="tab">
                            <h4 class="panel-title"><a aria-controls="collapseOne" aria-expanded="true" class="accordion-toggle collapsed" data-parent="#accordion" data-toggle="collapse" href="#collapseOne" role="button"> <?=$value?> </a></h4>
                        </div>
                        <div aria-labelledby="headingOne" class="panel-collapse collapse-acao-cont " id="collapseOne" role="tabpanel"  >
                            <div class="panel-body">
                            <?= $acao->text_content->$key?>
                            </div>
                        </div>
                    </div>
                <?php endforeach ?>

            </div>
        </div>

    </div>
</div>

<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
