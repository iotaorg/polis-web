<div class="table-responsive">
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
        <td><?= @$dados->data->{  $l->k }->{ $h->k } ?></td>
        <?endforeach?>

    </tr>
<?endforeach?>

</table>
</div>