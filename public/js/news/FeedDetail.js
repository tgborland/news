/**
 * @class FeedViewer.FeedDetail
 * @extends Ext.panel.Panel
 *
 * Shows the details of a particular feed
 * 
 * @constructor
 * Create a new Feed Detail
 * @param {Object} config The config object
 */
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

Ext.define('FeedViewer.FeedDetail', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.feeddetail',

    border: false,

    newsForm: false,
    newsWindow: false,
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            items: [this.createGrid()]
        });

        this.newsForm = Ext.createWidget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 10,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [
            {
                xtype: 'hiddenfield',
                name: '_id',
                allowBlank: true
            },
            {
                xtype: 'textfield',
                name: 'title',
                fieldLabel: 'Название',
                afterLabelTextTpl: required,
                allowBlank: false
            }, {
                xtype: 'textareafield',
                name: 'body',
                fieldLabel: 'Текст новости',
                labelAlign: 'top',
                flex: 1,
                margins: '0',
                afterLabelTextTpl: required,
                allowBlank: false
            }, {
                xtype: 'textfield',
                name: 'tags',
                fieldLabel: 'Теги (через запятую)',
                allowBlank: true
            }],

            buttons: [{
                text: 'Отмена',
                handler: function() {
                    this.up('form').getForm().reset();
                    this.up('window').hide();
                }
            }, {
                text: 'Сохранить',
                handler: function() {
                    var form = this.up('form').getForm();
                    var window = this.up('window');

                    if (form.isValid()) {
                        $.post('/save', form.getValues(), function(data){
                            if (data['ok'] == "1") {
                                form.reset();
                                window.hide();
                                window.panel.grid.getStore().load();
                                window.panel.refreshTags();
                            } else {
                                Ext.MessageBox.alert("Ошибка", "Ошибка сохранения новости");
                            }
                        }, "json")
                        .fail(function() {
                            Ext.MessageBox.alert("Ошибка", "Ошибка сохранения новости");
                        });
                    }
                }
            }]
        });

        this.newsWindow = Ext.widget('window', {
            panel: this,
            title: 'Редактирование новости',
            closeAction: 'hide',
            width: 400,
            height: 400,
            minWidth: 300,
            minHeight: 300,
            layout: 'fit',
            resizable: true,
            modal: true,
            items: this.newsForm,
            defaultFocus: 'title'
        });

        this.callParent(arguments);
    },

    /**
     * Creates the feed grid
     * @private
     * @return {FeedViewer.FeedGrid} feedGrid
     */
    createGrid: function(){
        this.grid = Ext.create('widget.feedgrid', {
            region: 'center',
            dockedItems: [this.createTopToolbar(), this.createTagsToolbar()],
            flex: 2,
            minHeight: 200,
            minWidth: 150,
            listeners: {
                scope: this,
                select: this.onSelect
            }
        });
        return this.grid;
    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        // this.display.setActive(rec);
    },

    /**
     * Creates top controller toolbar.
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createTopToolbar: function(){
        this.toolbar = Ext.create('widget.toolbar', {
            cls: 'x-docked-noborder-top',
            items: [
            {
                text: 'Добавить',
                scope: this,
                handler: this.onNew,
                icon: '/img/add.gif'
            },
            {
                text: 'Редактировать',
                scope: this,
                handler: this.onEdit,
                icon: '/img/edit.gif'
            },
            {
                text: 'Удалить',
                scope: this,
                handler: this.onDelete,
                icon: '/img/delete.gif'
            }]
        });
        return this.toolbar;
    },

    createTagsToolbar: function(){
        this.tagsToolbar = Ext.create('widget.toolbar', {
            //cls: 'x-docked-noborder-top',
            panel: this,
            prependText: 'Фильтровать по тегам',
            items: [{
                xtype: 'text',
                text: 'Фильтр по тегам:',
                scope: this,
                height: 19
            }]
        });

        this.refreshTags();

        return this.tagsToolbar;
    },

    refreshTags: function() {
        var tagsToolbar = this.tagsToolbar;
        var panel = this;

        tagsToolbar.removeAll();
        tagsToolbar.add({
            xtype: 'text',
            text: 'Фильтр по тегам:',
            scope: this,
            height: 19
        });

        $.get('/tags', {}, function(data){
            if (data) {
                for (var i=0; i<data.length; i++) {
                    tagsToolbar.add({
                        text: data[i],
                        enableToggle: true,
                        scope: this,
                        toggleHandler: panel.onTagSelected
                    });
                }
            }

        }, 'json').fail(function() {
            Ext.MessageBox.alert("Ошибка", "Ошибка обновления тегов");
        });

    },

    onTagSelected: function(button, state){
        var tags = [];
        tagsToolbar = button.ownerCt;

        for (var i=1; i<tagsToolbar.items.length; i++) {
            el = tagsToolbar.items.get(i);
            if (el.pressed) {
                tags.push(tagsToolbar.items.get(i).getText());
            }
        }

        tagsToolbar.panel.grid.store.load({params: {'tags[]': tags}});
    },

    /**
     *
     */
    onNew: function(){
        this.newsWindow.show();
    },

    /**
     *
     */
    onEdit: function(){
        var record = this.grid.getSelectionModel().getSelection();
        var selected = record[0];

        if (selected) {
            this.newsForm.loadRecord(selected);
            this.newsWindow.show();
        }
    },

    /**
     * Reacts to the open all being clicked
     * @private
     */
    onDelete: function(){
        var grid = this.grid;
        var record = grid.getSelectionModel().getSelection();
        var selected = record[0];

        grid.disable();
        if (selected) {
            var id = selected.data._id;

            $.get('/delete', {id: id}, function(data){
                if (data['ok'] == "1") {
                    grid.getStore().remove(record);
                    grid.enable();
                    grid.getStore().load();
                }
            }, "json")
            .fail(function() {
                Ext.MessageBox.alert('Ошибка', "Ошибка удаления новости", function(){
                    grid.enable();
                });
            });
        }
    }
});