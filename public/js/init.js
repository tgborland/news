/**
 * Created with JetBrains PhpStorm.
 * User: tgborland
 * Date: 05.06.13
 * Time: 19:58
 * To change this template use File | Settings | File Templates.
 */

Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('FeedViewer', 'js/news');

Ext.require([
    'Ext.Msg',
    'FeedViewer.FeedGrid',
    'FeedViewer.FeedDetail',
    'Ext.ux.PreviewPlugin',
    'Ext.toolbar.Paging',
]);

Ext.onReady(function(){
    news.init();

    Ext.create('FeedViewer.FeedDetail', {
        renderTo: 'news-container',
        height: 500
    });
});

$(document).ready(function(){
    $(document).on('submit', '.news-form', function(){
        news.save($(this).serialize());

        return false;
    });
});


