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
    'FeedViewer.FeedPost',
    'Ext.ux.PreviewPlugin',
]);

Ext.onReady(function(){
    news.init();

    /**
     * FeedViewer
     */


    Ext.define('Feed', {
        extend: 'Ext.data.Model',
        fields: ['title', 'url']
    });

    Ext.define('FeedItem', {
        extend: 'Ext.data.Model',
        fields: ['title', 'author', {
            name: 'pubDate',
            type: 'date'
        }, 'link', 'description', 'content']
    });

    /**
     * KitchenSink
     */

    Ext.define('KitchenSink.model.Company', {
        extend: 'Ext.data.Model',
        fields: [
           {name: 'company'},
           {name: 'price', type: 'float'},
           {name: 'change', type: 'float'},
           {name: 'pctChange', type: 'float'},
           {name: 'lastChange', type: 'date',  dateFormat: 'n/j h:ia'},
            // Rating dependent upon performance 0 = best, 2 = worst
            {
                name: 'rating',
                type: 'int',
                convert: function(value, record) {
                    var pct = record.get('pctChange');
                    if (pct < 0)
                        return 2;
                    if (pct < 1)
                        return 1;
                    return 0;
                }
            }
        ]
    });

    Ext.define('KitchenSink.data.DataSets', {
        singleton: true,

        company: [
            ['3m Co',                               71.72, 0.02,  0.03,  '9/1 12:00am'],
            ['Alcoa Inc',                           29.01, 0.42,  1.47,  '9/1 12:00am'],
            ['Altria Group Inc',                    83.81, 0.28,  0.34,  '9/1 12:00am'],
            ['American Express Company',            52.55, 0.01,  0.02,  '9/1 12:00am'],
            ['American International Group, Inc.',  64.13, 0.31,  0.49,  '9/1 12:00am'],
            ['AT&T Inc.',                           31.61, -0.48, -1.54, '9/1 12:00am'],
            ['Boeing Co.',                          75.43, 0.53,  0.71,  '9/1 12:00am'],
            ['Caterpillar Inc.',                    67.27, 0.92,  1.39,  '9/1 12:00am'],
            ['Citigroup, Inc.',                     49.37, 0.02,  0.04,  '9/1 12:00am'],
            ['E.I. du Pont de Nemours and Company', 40.48, 0.51,  1.28,  '9/1 12:00am'],
            ['Exxon Mobil Corp',                    68.1,  -0.43, -0.64, '9/1 12:00am'],
            ['General Electric Company',            34.14, -0.08, -0.23, '9/1 12:00am'],
            ['General Motors Corporation',          30.27, 1.09,  3.74,  '9/1 12:00am'],
            ['Hewlett-Packard Co.',                 36.53, -0.03, -0.08, '9/1 12:00am'],
            ['Honeywell Intl Inc',                  38.77, 0.05,  0.13,  '9/1 12:00am'],
            ['Intel Corporation',                   19.88, 0.31,  1.58,  '9/1 12:00am'],
            ['International Business Machines',     81.41, 0.44,  0.54,  '9/1 12:00am'],
            ['Johnson & Johnson',                   64.72, 0.06,  0.09,  '9/1 12:00am'],
            ['JP Morgan & Chase & Co',              45.73, 0.07,  0.15,  '9/1 12:00am'],
            ['McDonald\'s Corporation',             36.76, 0.86,  2.40,  '9/1 12:00am'],
            ['Merck & Co., Inc.',                   40.96, 0.41,  1.01,  '9/1 12:00am'],
            ['Microsoft Corporation',               25.84, 0.14,  0.54,  '9/1 12:00am'],
            ['Pfizer Inc',                          27.96, 0.4,   1.45,  '9/1 12:00am'],
            ['The Coca-Cola Company',               45.07, 0.26,  0.58,  '9/1 12:00am'],
            ['The Home Depot, Inc.',                34.64, 0.35,  1.02,  '9/1 12:00am'],
            ['The Procter & Gamble Company',        61.91, 0.01,  0.02,  '9/1 12:00am'],
            ['United Technologies Corporation',     63.26, 0.55,  0.88,  '9/1 12:00am'],
            ['Verizon Communications',              35.57, 0.39,  1.11,  '9/1 12:00am'],
            ['Wal-Mart Stores, Inc.',               45.45, 0.73,  1.63,  '9/1 12:00am']
        ],

        states: [
            ['AL', 'Alabama', 'The Heart of Dixie'],
            ['AK', 'Alaska', 'The Land of the Midnight Sun'],
            ['AZ', 'Arizona', 'The Grand Canyon State'],
            ['AR', 'Arkansas', 'The Natural State'],
            ['CA', 'California', 'The Golden State'],
            ['CO', 'Colorado', 'The Mountain State'],
            ['CT', 'Connecticut', 'The Constitution State'],
            ['DE', 'Delaware', 'The First State'],
            ['DC', 'District of Columbia', "The Nation's Capital"],
            ['FL', 'Florida', 'The Sunshine State'],
            ['GA', 'Georgia', 'The Peach State'],
            ['HI', 'Hawaii', 'The Aloha State'],
            ['ID', 'Idaho', 'Famous Potatoes'],
            ['IL', 'Illinois', 'The Prairie State'],
            ['IN', 'Indiana', 'The Hospitality State'],
            ['IA', 'Iowa', 'The Corn State'],
            ['KS', 'Kansas', 'The Sunflower State'],
            ['KY', 'Kentucky', 'The Bluegrass State'],
            ['LA', 'Louisiana', 'The Bayou State'],
            ['ME', 'Maine', 'The Pine Tree State'],
            ['MD', 'Maryland', 'Chesapeake State'],
            ['MA', 'Massachusetts', 'The Spirit of America'],
            ['MI', 'Michigan', 'Great Lakes State'],
            ['MN', 'Minnesota', 'North Star State'],
            ['MS', 'Mississippi', 'Magnolia State'],
            ['MO', 'Missouri', 'Show Me State'],
            ['MT', 'Montana', 'Big Sky Country'],
            ['NE', 'Nebraska', 'Beef State'],
            ['NV', 'Nevada', 'Silver State'],
            ['NH', 'New Hampshire', 'Granite State'],
            ['NJ', 'New Jersey', 'Garden State'],
            ['NM', 'New Mexico', 'Land of Enchantment'],
            ['NY', 'New York', 'Empire State'],
            ['NC', 'North Carolina', 'First in Freedom'],
            ['ND', 'North Dakota', 'Peace Garden State'],
            ['OH', 'Ohio', 'The Heart of it All'],
            ['OK', 'Oklahoma', 'Oklahoma is OK'],
            ['OR', 'Oregon', 'Pacific Wonderland'],
            ['PA', 'Pennsylvania', 'Keystone State'],
            ['RI', 'Rhode Island', 'Ocean State'],
            ['SC', 'South Carolina', 'Nothing Could be Finer'],
            ['SD', 'South Dakota', 'Great Faces, Great Places'],
            ['TN', 'Tennessee', 'Volunteer State'],
            ['TX', 'Texas', 'Lone Star State'],
            ['UT', 'Utah', 'Salt Lake State'],
            ['VT', 'Vermont', 'Green Mountain State'],
            ['VA', 'Virginia', 'Mother of States'],
            ['WA', 'Washington', 'Green Tree State'],
            ['WV', 'West Virginia', 'Mountain State'],
            ['WI', 'Wisconsin', "America's Dairyland"],
            ['WY', 'Wyoming', 'Like No Place on Earth']
        ]
    });

    Ext.define('KitchenSink.view.form.FormGrid', {
        extend: 'Ext.form.Panel',

        requires: [
            'Ext.grid.*',
            'Ext.form.*',
            'Ext.layout.container.Column',
            'KitchenSink.model.Company'
        ],
        xtype: 'form-grid',


        frame: true,
        title: 'Company data',
        bodyPadding: 5,
        layout: 'column',

        renderTo: 'grid-panel',

        initComponent: function(){
            Ext.apply(this, {
                width: 880,
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 90,
                    anchor: '100%',
                    msgTarget: 'side'
                },

                items: [{
                    columnWidth: 0.65,
                    xtype: 'gridpanel',
                    store: new Ext.data.Store({
                        model: KitchenSink.model.Company,
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'array'
                            }
                        },
                        data: KitchenSink.data.DataSets.company
                    }),
                    height: 400,
                    columns: [{
                        text: 'Company',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'company'
                    }, {
                        text: 'Price',
                        width: 75,
                        sortable: true,
                        dataIndex: 'price'
                    }, {
                        text: 'Change',
                        width: 80,
                        sortable: true,
                        renderer: this.changeRenderer,
                        dataIndex: 'change'
                    }, {
                        text: '% Change',
                        width: 100,
                        sortable: true,
                        renderer: this.pctChangeRenderer,
                        dataIndex: 'pctChange'
                    }, {
                        text: 'Last Updated',
                        width: 115,
                        sortable: true,
                        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                        dataIndex: 'lastChange'
                    }, {
                        text: 'Rating',
                        width: 60,
                        sortable: true,
                        renderer: this.renderRating,
                        dataIndex: 'rating'
                    }],
                    listeners: {
                        scope: this,
                        selectionchange: this.onSelectionChange
                    }
                }, {
                    columnWidth: 0.35,
                    margin: '0 0 0 10',
                    xtype: 'fieldset',
                    title:'Company details',
                    layout: 'anchor',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel: 'Name',
                        name: 'company'
                    },{
                        fieldLabel: 'Price',
                        name: 'price'
                    },{
                        fieldLabel: '% Change',
                        name: 'pctChange'
                    },{
                        xtype: 'datefield',
                        fieldLabel: 'Last Updated',
                        name: 'lastChange'
                    }, {
                        xtype: 'radiogroup',
                        fieldLabel: 'Rating',
                        columns: 3,
                        defaults: {
                            name: 'rating' //Each radio has the same name so the browser will make sure only one is checked at once
                        },
                        items: [{
                            inputValue: '0',
                            boxLabel: 'A'
                        }, {
                            inputValue: '1',
                            boxLabel: 'B'
                        }, {
                            inputValue: '2',
                            boxLabel: 'C'
                        }]
                    }]
                }]
            });
            this.callParent();
        },

        changeRenderer: function(val) {
            if (val > 0) {
                return '<span style="color:green;">' + val + '</span>';
            } else if(val < 0) {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        },

        pctChangeRenderer: function(val){
            if (val > 0) {
                return '<span style="color:green;">' + val + '%</span>';
            } else if(val < 0) {
                return '<span style="color:red;">' + val + '%</span>';
            }
            return val;
        },

        renderRating: function(val){
            switch (val) {
                case 0:
                    return 'A';
                case 1:
                    return 'B';
                case 2:
                    return 'C';
            }
        },

        onSelectionChange: function(model, records) {
            var rec = records[0];
            if (rec) {
                this.getForm().loadRecord(rec);
            }
        }

    });

    Ext.create('FeedViewer.FeedDetail' /*'KitchenSink.view.form.FormGrid'*/, {
        renderTo: 'grid-panel',
        height: '500px'
    });

});

$(document).ready(function(){
    $(document).on('submit', '.news-form', function(){
        news.save($(this).serialize());

        return false;
    });
});


