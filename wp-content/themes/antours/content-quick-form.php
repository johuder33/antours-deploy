<?php

// custom id for UI
$postID = "package-".$post->ID;
// post title
$post_title = $post->post_title;

$fields = renderQuickFields("data-id", $postID);

?>

<div class="quick-form" id="<?php echo $postID; ?>">
    <div class="quick-container">
        <div class="quick-form-container">
            <div class="layout-loader" id="loader-<?php echo $post->ID; ?>">
                <div class="wrapper-loader">
                    <i class="fa fa-spinner fa-spin fa-5x"></i>
                </div>
            </div>
            <form class="form">
                <?php
                    echo $fields;
                ?>
            </form>
        </div>

        <div class="quick-control">
            <div class="detail-note">
                <div class="title btn-close-quick-form" data-id="<?php echo $postID; ?>">
                    <span class="glyphicon glyphicon-remove">
                    </span>
                    <span>
                        <?php echo $post_title; ?>
                    </span>
                </div>

                <div class="action">
                    <button type="button" data-id="<?php echo $postID; ?>" class="btn btn-default text-uppercase btn-makeReserve">Enviar</button>
                </div>
            </div>
        </div>
    </div>
</div>