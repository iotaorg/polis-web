<div class="table-responsive">
<table class="table table-bordered table-condensed table-striped table-hover">
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

<? foreach ( $dados->lines as $l ): ?>
    <tr>
        <th><?=$l->v?></th>

        <? foreach ( $dados->headers as $h ): $v = empty($dados->data->{  $l->k }->{ $h->k }) ? '' : $dados->data->{  $l->k }->{ $h->k }; $c=  empty($dados->variable_colors->{$h->k}->$v) ? '' : $dados->variable_colors->{$h->k}->$v?>

        <td <?if($c):?>style="background-color: <?=$c?>; color:<?=$c ?>;" ><span class="invert"><?else:?><span><?endif?><? echo (  is_null($v) ? '-' : $v) ?></span></td>
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