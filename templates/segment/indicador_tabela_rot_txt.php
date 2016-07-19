<div class="table-responsive">
<table class="table table-bordered table-condensed table-striped table-hover">
<colgroup>
<col/>
    <? foreach ( $dados->headers as $h ): ?>
        <col style="width: 80px"/>
    <?endforeach?>
</colgroup>
<thead>
<tr>
    <th>Município</th>
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

        <? foreach ( $dados->headers as $h ): $v = empty($dados->data->{  $l->k }->{ $h->k }) ? '' : $dados->data->{  $l->k }->{ $h->k }; $c=  empty($dados->variable_colors->{$h->k}->$v) ? '' : $dados->variable_colors->{$h->k}->$v?>

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