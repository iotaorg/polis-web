<?php $this->extend('layout/default.php');?>

<!-- page-title -->


<?php $this->begin('content');?>
    <section class="home text-center">
        <div class="container">
            <div class="col-sm-12">
                <a href="/"><div class="home-logo-wraper hidden-xs"><img src="/static2/css/images/logo-monitoramento-branco.svg?v=1"></div></a>

            </div>
        </div>
</section>
<div class="content-pagina">
    <div class="container">

    <h1><?php $this->begin('title');?> <?=$pagina->title?><?php $this->end();?></h1>

    <?=$pagina->content?>

    </div>
</div>

<?php $this->end();?>


<?php $this->begin('scripts');?>
<?php $this->end();?>
