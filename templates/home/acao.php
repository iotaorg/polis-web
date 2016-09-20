<?php $this->extend('layout/default.php');?>

<!-- page-title -->
<?php $this->begin('title');?><?=$acao->name?><?php $this->end();?>


<?php $this->begin('content');?>

<section data-codigo-acao="<?=$acao->eixo_acao?>" class="home acao-home acao-eixo<? $eixo= preg_replace('/[^0-9]*/', '', $acao->axis_name); echo $eixo ?>">
    <div class="container">
        <div class="acao-header-title-wrap">
            <a href="/?eixo=<?=$eixo?>"><img src="/static2/images/eixo<?= $eixo ?>.png" alt="Icone para <?= $acao->axis_name ?>"></a>
            <h1><?=$acao->name?></h1>
            <p><?=$acao->description?></p>
        </div>
    </div>
</section>

<div class="acao-content-wrap">
    <div class="container">

        <? if ($acao->text_content->txt_titulo_mapa):?>
        <div class="mapa-acao-wrap">
            <h3 class="titulo-mapa"><?= $acao->text_content->txt_titulo_mapa?></h3>
            <h4 class="descricao-mapa"><?= str_replace('src=', 'data-src=', $acao->text_content->txt_descricao_mapa) ?></h4>
        </div>
        <?endif?>


        <div class="acao-acordeon">
            <div aria-multiselectable="true" class="panel-group" id="accordion-acao" role="tablist">
                <?php $cont=0; foreach ( array (
                    "txt_info_qualitativas" => 'Informações Qualitativas',
                    "txt_condicionantes"    => 'Condicionantes Ambientais e Projetos Relevantes',
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


        <div class="row">
            <? if (!empty($indicadores)): ?>
            <h2>Indicadores</h2>
            <? foreach ( $indicadores as $i ): ?>
                <noscript>
                    <h3><?=$i->name?></h3>
                    <dl>
                        <dt>Descrição da Fórmula</dt><dd> <?=$i->descricao_formula?></dd>
                        <dt>Nossa leitura</dt><dd> <?=$i->nossa_leitura?></dd>
                    </dl>
                    <iframe width="100%" style="border:none" height=400 src="/ajax/indicador_tabela_rot_regiao?id=<?=urlencode($i->id)?>&amp;variable_type=<?=$i->variable_type?>&amp;template_name=<?=urlencode($acao->template_name)?>">
                    </iframe>
                </noscript>

                <div class="jsonly col-xs-12">
                    <h3><?=$i->name?></h3>
                  <!-- Nav tabs -->
                  <ul class="nav nav-tabs" role="tablist">
                    <?$any_active=0?>
                    <?if (!(@$i->variable_type == 'str')): $any_active++?>
                    <li role="presentation" class="active"><a href="#visualizacao<?=$i->id?>" aria-controls="visualizacao<?=$i->id?>" role="tab" data-toggle="tab">Visualização</a></li>
                    <?endif?>
                    <?if ((@$i->variable_type == 'str' && $i->graph_type == 'pie')): $any_active++?>
                    <li role="presentation" class="active"><a href="#visualizacao<?=$i->id?>" aria-controls="visualizacao<?=$i->id?>" role="tab" data-toggle="tab">Visualização</a></li>
                    <?endif?>
                    <li role="presentation" class="<?if (!$any_active): ?>active<?endif?>" ><a href="#tabela<?=$i->id?>" aria-controls="tabela<?=$i->id?>" role="tab" data-toggle="tab">Tabela</a></li>
                    <?if ($i->descricao_formula ):?><li role="presentation"><a href="#formula<?=$i->id?>" aria-controls="formula<?=$i->id?>" role="tab" data-toggle="tab">Fórmula</a></li><?endif?>
                    <?if ($i->nossa_leitura):?><li role="presentation"><a href="#leitura<?=$i->id?>" aria-controls="leitura<?=$i->id?>" role="tab" data-toggle="tab">Nossa leitura</a></li><?endif?>
                    <li role="presentation"><a href="#dados<?=$i->id?>" aria-controls="dados<?=$i->id?>" role="tab" data-toggle="tab">Dados abertos</a></li>
                  </ul>

                  <!-- Tab panes -->
                  <div class="tab-content tab-indicador loading" data-graph-type="<?=$i->graph_type?>" data-template="<?=htmlentities($acao->template_name)?>" data-variable-type="<?=$i->variable_type?>" data-id="<?=$i->id?>">
                    <?$any_active=0?>
                    <?if (!(@$i->variable_type == 'str')): $any_active++?>
                    <div role="tabpanel" class="tab-pane graph active " id="visualizacao<?=$i->id?>">
                        <h4 class="text-center">Carregando gráficos...</h4>
                        <img class="tableload img-responsive" src="/static2/images/tableload.gif"/>
                    </div>
                    <?endif?>
                    <?if ((@$i->variable_type == 'str') && ($i->graph_type == 'pie') ): $any_active++?>
                    <div role="tabpanel" class="tab-pane graph active " id="visualizacao<?=$i->id?>">
                        <h4 class="text-center">Carregando gráficos...</h4>
                        <img class="tableload img-responsive" src="/static2/images/tableload.gif"/>
                    </div>
                    <?endif?>
                    <div role="tabpanel" class="tab-pane table <?if ((@$i->variable_type == 'str')): ?>table-txt <?endif?><?if(!$any_active):?>active<?endif?>" id="tabela<?=$i->id?>">
                        <h4 class="text-center">Carregando tabela...</h4>
                        <img class="tableload img-responsive" src="/static2/images/tableload.gif"/>

                    </div>
                    <?if ($i->descricao_formula ):?><div role="tabpanel" class="tab-pane" id="formula<?=$i->id?>"> <?=$i->descricao_formula?></div><?endif?>
                    <?if ($i->nossa_leitura):?><div role="tabpanel" class="tab-pane" id="leitura<?=$i->id?>"> <?=$i->nossa_leitura?></div><?endif?>

                    <div role="tabpanel" class="tab-pane pane-opendata" id="dados<?=$i->id?>">
                        <h4>Você pode consumir este indicador nos seguintes formatos:</h4>

                        <dl class="dl-horizontal">
                            <? $download = '/polis/' . ($i->variable_type =='str' ? 'indicador_tabela_rot_txt' :'indicador_tabela_rot_regiao') . '/' .$i->id ?>
                            <dt>Dados tabulados:</dt><dd> <a class="btn btn-default" href="<?=$download?>?download=xls">XLS</a> <a class="btn btn-default" href="<?=$download?>?download=csv">CSV</a> <a class="btn btn-default" target="_new" href="<?=$download?>">JSON</a> </dd>
                            <? $download = '/api/download-indicators?indicator_id='.$i->id ?>
                            <dt>Resultados por região:</dt><dd> <a class="btn btn-default" href="<?=$download?>&download=xls">XLS</a> <a class="btn btn-default" href="<?=$download?>&download=csv">CSV</a> <a class="btn btn-default" target="_new" href="<?=$download?>">JSON</a></dd>
                            <? $download = '/api/download-variables?indicator_id='.$i->id ?>
                            <dt>Linhas das variáveis:</dt><dd> <a class="btn btn-default" href="<?=$download?>&download=xls">XLS</a> <a class="btn btn-default" href="<?=$download?>&download=csv">CSV</a> <a class="btn btn-default" target="_new" href="<?=$download?>">JSON</a></dd>
                        </dl>
                    </div>

                    </div>
                </div>

            <?php endforeach ?>
            <?endif?>

            <? if ($acao->text_content->txt_glossario):?>
            <h2>Glossário</h2>
            <div class="acao-glosario-wrap">
                <?=$acao->text_content->txt_glossario?>
            </div>
            <?endif?>
        </div>

    </div>
</div>

<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
