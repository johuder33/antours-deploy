<?php get_header(); ?>

    <div class="row">
        <?php get_template_part("content", "menu"); ?>

        <div class="col-xs-12">
            <?php get_template_part("content", "reservation"); ?>
        </div>
    </div>

    <div class="row">
        <?php get_template_part("content", "packages-grid")?>
    <div>

<?php get_footer(); ?>