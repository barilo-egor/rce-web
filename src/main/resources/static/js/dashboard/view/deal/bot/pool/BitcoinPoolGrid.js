Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolGrid', {
    extend: 'Ext.Panel',
    xtype: 'bitcoinpoolgrid',
    requires: [
        'Dashboard.view.deal.bot.pool.BitcoinPoolController'
    ],
    controller: 'bitcoinPoolController',

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            reference: 'bitcoinPoolGrid',
            store: 'bitcoinPoolStore',

            listeners: {
                painted: function (me) {
                    me.getStore().load()
                }
            },
            plugins: {
                summaryrow: true
            },

            toolContextMenu: {
                xtype: 'menu',
                items: [
                    {
                        text: 'Удалить из пула',
                        iconCls: 'x-fa fa-trash-alt redColor',
                        handler: function (me) {
                            alert('ok')
                        }
                    }
                ]
            },

            columns: [
                {
                    text: 'Адрес',
                    dataIndex: 'wallet',
                    flex: 0.65
                },
                {
                    text: 'Сумма',
                    dataIndex: 'cryptoAmount',
                    flex: 0.35,
                    summary: 'sum',
                    summaryRenderer: function (value) {
                        return 'Общая сумма: ' + value;
                    }
                }
            ],
        }
    ]
})