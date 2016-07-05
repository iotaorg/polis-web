<div class="table-responsive" <?= ( is_null($js) ? '' : 'data-json="' . htmlentities($json) . '"' )?>>
<table class="table table-bordered table-condensed table-striped table-hover">
<thead>
<tr>
    <th>Ano</th>
    <? foreach ( $dados->headers as $h ): ?>
        <th><?=$h->v?></th>
    <?endforeach?>
</tr>
</thead>
<tbody>
</tbody>

<? foreach ( $dados->lines as $l ): ?>
    <tr>
        <th><?=$l->v?></th>

        <? foreach ( $dados->headers as $h ): ?>
        <td><? $v = @$dados->data->{  $l->k }->{ $h->k }; echo (  is_null($v) ? '-' : $v) ?></td>
        <?endforeach?>

    </tr>
<?endforeach?>

</table>
</div>