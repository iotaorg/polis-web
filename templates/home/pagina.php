<?php $this->extend('layout/default.php');?>

<!-- page-title -->


<?php $this->begin('content');?>

<div class="acao-content-wrap">
    <div class="container">

    <h1><?php $this->begin('title');?>  Página <?=$pagina->title?><?php $this->end();?></h1>

    <?=$pagina->content?>

    </div>
</div>

<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
