<?php

global $domain, $wp_query;
$paged = get_query_var('page') ? get_query_var('page') : 1 ;
// build select tag
$selectTagFilter = buildFilter(array("filter-by-category", "form-control"), null, __('Filter by category', $domain));

?>

<div class="col-xs-12">
    <div class="packages-grid center-block">
        <section>
            <form class="form-inline text-right" id="filter-form">
                <div class="container-filter-form">
                    <div class="form-group">
                        <?php echo $selectTagFilter; ?> 
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn btn-default">
                            <?php _e("Apply filter", $domain); ?>
                        </button>
                    </div>
                </div>
            </form>
        </section>
        <div class="row">
            <?php
                while(have_posts()) {
                    the_post();
                    get_template_part("content", "template-package");
                }
            ?>
        </div>

        <div class="text-right">
            <?php
                // show pagination
                show_wp_paginate($paged, $wp_query->max_num_pages);
            ?>
        </div>
    <div>
</div>