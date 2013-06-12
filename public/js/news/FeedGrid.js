var itemsPerPage = 10;

Ext.define('FeedViewer.FeedGrid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.feedgrid',

    initComponent: function(){
        this.addEvents(
            /**
             * @event rowdblclick
             * Fires when a row is double clicked
             * @param {FeedViewer.FeedGrid} this
             * @param {Ext.data.Model} model
             */
            'rowdblclick',
            /**
             * @event select
             * Fires when a grid row is selected
             * @param {FeedViewer.FeedGrid} this
             * @param {Ext.data.Model} model
             */
            'select'
        );

        var store = Ext.create('Ext.data.Store', {
            fields:['_id', 'title', 'body', 'tags'],
            pageSize: itemsPerPage,
            autoLoad: {start: 0, limit: itemsPerPage},
            proxy: {
                type: 'ajax',
                url: '/resultJson',
                enablePaging: true,
                reader: {
                    type: 'json',
                    root: 'items',
                    totalProperty: 'total'
                },
                listeners: {
                    exception: this.onProxyException,
                    scope: this
                }
            },
            listeners: {
                load: this.onLoad,
                remove: this.onRemove,
                scope: this
            }
        });

        Ext.apply(this, {
            cls: 'feed-grid',
            store: store,
            viewConfig: {
                itemId: 'view',
                plugins: [{
                    pluginId: 'preview',
                    ptype: 'preview',
                    bodyField: 'body',
                    expanded: true
                }],
                listeners: {
                    scope: this,
                    itemdblclick: this.onRowDblClick
                }
            },
            columns: [{
                text: 'Title',
                dataIndex: 'title',
                flex: 1,
                renderer: this.formatTitle
            }, {
                text: 'Tags',
                dataIndex: 'tags'
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                pageSize: itemsPerPage,
                store: store,
                displayInfo: true
            }
        });
        this.callParent(arguments);
        this.on('selectionchange', this.onSelect, this);
    },

        /**
     * Reacts to a double click
     * @private
     * @param {Object} view The view
     * @param {Object} index The row index
     */
    onRowDblClick: function(view, record, item, index, e) {
        this.fireEvent('rowdblclick', this, this.store.getAt(index));
    },

    /**
     * React to a grid item being selected
     * @private
     * @param {Ext.model.Selection} model The selection model
     * @param {Array} selections An array of selections
     */
    onSelect: function(model, selections){
        var selected = selections[0];
        if (selected) {
            this.fireEvent('select', this, selected);
        }
    },

    /**
     * Listens for the store loading
     * @private
     */
    onLoad: function(store, records, success) {
        if (this.getStore().getCount()) {
            this.getSelectionModel().select(0);
        }
    },

    /**
     * Listen for proxy eerrors.
     */
    onProxyException: function(proxy, response, operation) {
        Ext.Msg.alert("Error with data from server", operation.error);
        this.view.el.update('');
        
        // Update the detail view with a dummy empty record
        this.fireEvent('select', this, {data:{}});
    },

    /**
     * Title renderer
     * @private
     */
    formatTitle: function(value, p, record){
        //return Ext.String.format('<div class="topic"><b>{0}</b><span class="author">{1}</span></div>', value, record.get('author') || "Unknown");
        return Ext.String.format('<div class="topic"><b>{0}</b></div>', value);
    },

});
