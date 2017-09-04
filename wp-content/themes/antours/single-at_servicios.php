<?php
get_header();

global $packages, $wp_query, $wp_rewrite;
$category = get_the_terms($post->ID, 'antours-category');



?>

<div class="row">
    <?php get_template_part("content", "menu"); ?>

    <div class="col-xs-12">
        <?php //get_template_part("content", "banners"); ?>
        <?php //get_template_part("content", "reservation"); ?>
        
        <?php

            if (count($category) > 0) {
                $category = array_shift($category);
                //var_dump($wp_query->query['page']);
                // pagination
                $paged = get_query_var('page') ? get_query_var('page') : 1 ;
                // make query
                $args = array('tax_query' => array( 
                        array( 
                            'taxonomy' => 'antours-category',
                            'field' => 'id', 
                            'terms' => array($category->term_id) 
                        )),
                        'post_type' =>  $packages,
                        'post_status' => 'publish',
                        'paged' => $paged
                        );

                $posts = query_posts($args);

                if (have_posts()) {
                    get_template_part('content', 'packages-open');
                    while(have_posts()) {
                        the_post();
                        get_template_part('content', 'template-package');
                    }

                    get_template_part('content', 'packages-close');

                    // show pagination
                    show_wp_paginate($paged, $wp_query->max_num_pages);
                } else {
                    get_template_part("content", "not_found");
                }
            } else {
                get_template_part("content", "not_found");
            }
        ?>

    </div>
</div>

<?php get_footer(); ?>