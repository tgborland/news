/**
 * Created with JetBrains PhpStorm.
 * User: tgborland
 * Date: 30.05.13
 * Time: 18:59
 * To change this template use File | Settings | File Templates.
 */
var news = new function() {
    var _page = 1;

    this.init = function() {
        $('.edit-button').each(function() {
            Ext.create('Ext.button.Button', {
                text: 'редактировать',
                width: 150,
                renderTo: this,
                handler : function() {
                    var tr = $('#' + this.id).parents('tr:eq(0)');
                    tr.find('.news-view').hide();
                    tr.find('.news-edit').show();

                    // Ext.Msg.alert('Внимания','Нажата кнопка');
                }
            });
        });

        $('.delete-button').each(function() {
            Ext.create('Ext.button.Button', {
                text: 'удалить',
                width: 150,
                renderTo: this,
                handler : function() {
                    var tr = $('#' + this.id).parents('tr:eq(0)');
                    var id = tr.find('input.news-id').val();
                    news.delete(id);

                    //Ext.Msg.alert('Внимания','Нажата кнопка');
                }
            });
        });
    };

    this.load = function(page) {
        _page = page;

        $.get('/result', {page: page}, function(data) {
            $('#news-container').html(data);
        });
    };

    this.save = function(params) {
        $.get('/save?' + params, {}, function(data){
            if (data['ok'] == "1") {
                news.load(_page);
            }
        }, "json")
        .fail(function() { alert("ошибка сохранения новости"); })
    };

    this.delete = function(id) {
        $.get('/delete', {id: id}, function(data){
            if (data['ok'] == "1") {
                news.load(_page);
            }
        }, "json")
        .fail(function() { alert("ошибка удаления новости"); })
    }
};