<div class="table-responsive" <?= ( is_null($js) ? '' : 'data-json="' . htmlentities($json) . '"' )?>>
<table class="table txthover table-bordered table-condensed table-striped table-hover">
<colgroup>
<?$col_size = $_GET['template_name'] == 'layout2' ? 25 : 10;?>
<col style="width: <?=$col_size?>%"/>
    <? foreach ( $dados->headers as $h ): ?>
        <col style="width: <?=(100-$col_size)/sizeof($dados->headers)?>%"/>
    <?endforeach?>
</colgroup>
<thead>
<tr>
    <th><?=$_GET['template_name'] == 'layout2' ? 'Unidade de Conservação' : 'Município'?></th>
    <? foreach ( $dados->headers as $h ): ?>
        <th title="<?=$h->name?>"><?=$h->v?></th>
    <?endforeach?>
</tr>
</thead>
<tbody>
</tbody>

<?
$color = array(
'#FFF' => '#000',
'#000' => '#FFF',
'#d21b1b' => '#FFF',
'#FE9753' => '#000',
'#E2F98E' => '#000',
'#219859' => '#000');

foreach ( $dados->lines as $l ): ?>
    <tr>
        <th><?=$l->v?></th>

        <? foreach ( $dados->headers as $h ): $v = !isset($dados->data->{  $l->k }->{ $h->k }) ? '' : $dados->data->{  $l->k }->{ $h->k }; $c=  empty($dados->variable_colors->{$h->k}->$v) ? '' : $dados->variable_colors->{$h->k}->$v?>

        <td <?if($c):?>style="background-color: <?=$c?>; color:<?= $color[$c] ?>;"<?endif?>><? echo (  is_null($v) ? '-' : $v) ?></td>
        <?endforeach?>

    </tr>
<?endforeach?>

</table>
</div>
<dl class="dl-horizontal">
<? foreach ( $dados->headers as $h ): ?>
    <dt><?=$h->v?></tt><dd><?=$h->name?></dd>
<?endforeach?>
</dl>