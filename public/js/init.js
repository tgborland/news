/**
 * Created with JetBrains PhpStorm.
 * User: tgborland
 * Date: 05.06.13
 * Time: 19:58
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
    $(document).on('click', '.news-edit', function(){
        var tr = $(this).parents('tr:eq(0)');
        tr.find('.news-view').hide();
        tr.find('.news-edit').show();
    });


    $(document).on('submit', '.news-form', function(){
        news.save($(this).serialize());

        return false;
    });


});


