<?php $this->extend('layout/default.php');?>

<!-- page-title -->
<?php $this->begin('title');?>
  Ação <?=$acao->name?>
<?php $this->end();?>


<?php $this->begin('content');?>

<section class="home acao-home acao-eixo<?= preg_replace('/[^0-9]*/', '', $acao->axis_name)?>">
    <div class="container">
        <div class="acao-header-title-wrap">
            <img src="/static2/images/eixo<?= preg_replace('/[^0-9]*/', '', $acao->axis_name)?>.png" alt="Icone para <?= $acao->axis_name ?>">
            <h1><small><?=$acao->axis_name?></small> <?=$acao->name?></h1>
            <p><?=$acao->description?></p>
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
                <?php $cont=0; foreach ( array (
                    "txt_info_qualitativas" => 'Informações qualitativas',
                    "txt_condicionantes"    => 'Condicionantes ambientais',
                    "txt_focos"             => "Focos e Perguntas Orientadoras",
                ) as $key => $value ): $cont++; if ( @$acao->text_content->$key == '' ) continue ?>
                    <div class="panel panel-default collapse-acao-cont">
                        <div class="panel-heading" id="heading<?=$cont?>" role="tab">
                            <h4 class="panel-title"><a aria-controls="collapse<?=$cont?>" class="accordion-toggle <?= $key == 'txt_info_qualitativas' ? '' : 'collapsed'?>" data-parent="#accordion" data-toggle="collapse" href="#collapse<?=$cont?>" role="button"> <?=$value?> </a></h4>
                        </div>
                        <div aria-labelledby="heading<?=$cont?>" class="panel-collapse collapse <?= $key == 'txt_info_qualitativas' ? 'in' : ''?>" id="collapse<?=$cont?>" role="tabpanel"  >
                            <div class="panel-body">
                            <?= $acao->text_content->$key?>
                            </div>
                        </div>
                    </div>
                <?php endforeach ?>

            </div>
        </div>



        <h2>Indicadores</h2>
        <? foreach ( $indicadores as $i ): ?>
            <h3><?=$i->name?></h3>

            <div>
              <!-- Nav tabs -->
              <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#visualizacao<?=$i->id?>" aria-controls="visualizacao<?=$i->id?>" role="tab" data-toggle="tab">Visualização</a></li>
                <li role="presentation"><a href="#tabela<?=$i->id?>" aria-controls="tabela<?=$i->id?>" role="tab" data-toggle="tab">Tabela</a></li>
                <li role="presentation"><a href="#formula<?=$i->id?>" aria-controls="formula<?=$i->id?>" role="tab" data-toggle="tab">Fórmula</a></li>
                <li role="presentation"><a href="#leitura<?=$i->id?>" aria-controls="leitura<?=$i->id?>" role="tab" data-toggle="tab">Nossa leitura</a></li>
              </ul>

              <!-- Tab panes -->
              <div class="tab-content tab-indicador loading">
                <div role="tabpanel" class="tab-pane active "  id="visualizacao<?=$i->id?>">
                    <img class="tableload" src="/static2/images/tableload.gif"/>
                    <h4>Carregando gráficos...</h4>
                </div>
                <div role="tabpanel" class="tab-pane" id="tabela<?=$i->id?>">
                    <img class="tableload" src="/static2/images/tableload.gif"/>
                    <h4>Carregando tabela...</h4>
                </div>
                <div role="tabpanel" class="tab-pane" id="formula<?=$i->id?>"> <?=$i->descricao_formula?></div>
                <div role="tabpanel" class="tab-pane" id="leitura<?=$i->id?>"> <?=$i->nossa_leitura?></div>
                </div>

            </div>

        <?php endforeach ?>


        <? if ($acao->text_content->txt_glossario):?>
        <h2>Glossário</h2>
        <div class="acao-glosario-wrap">
            <?=$acao->text_content->txt_glossario?>
        </div>
        <?endif?>

    </div>
</div>

<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
