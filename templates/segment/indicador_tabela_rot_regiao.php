<div class="table-responsive" <?= ( is_null($js) ? '' : 'data-json="' . htmlentities($json) . '"' )?>>
<table class="table table-bordered table-condensed table-striped table-hover">
<thead>
<tr>
    <th>Ano</th>
    <? foreach ( $dados->headers as $h ): ?>
        <th <?=( $h->b ==1 ) ? 'class="bold"':''?>><?=$h->v?></th>
    <?endforeach?>
</tr>
</thead>
<tbody>
</tbody>

<? foreach ( $dados->lines as $l ): ?>
    <tr>
        <th><?=$l->v?></th>

        <? foreach ( $dados->headers as $h ): $v = !isset($dados->data->{  $l->k }->{ $h->k })  ? '' : $dados->data->{  $l->k }->{ $h->k }; ?>
        <td <?=( $h->b ==1 ) ? 'class="bold"':''?>><?if (isset($v)): ?><?=$dados->indicator->prepend_on_result ?> <?= (  !is_numeric($v) ? ($v ? $v : '-') : str_replace(',00', '', number_format((float)$v, 2, ',', '.')) ) ?> <?=@$dados->indicator->append_on_result ?><?endif?></td>
        <?endforeach?>

    </tr>
<?endforeach?>

</table>
</div>