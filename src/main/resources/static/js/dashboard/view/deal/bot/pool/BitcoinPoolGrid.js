Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'bitcoinpoolgrid',
    reference: 'bitcoinPoolGrid',
    requires: [
        'Dashboard.view.deal.bot.pool.BitcoinPoolController'
    ],
    controller: 'bitcoinPoolController',
    store: 'bitcoinPoolStore',

    listeners: {
        painted: function (me) {
            me.getStore().load()
        }
    },

    columns: [
        {
            text: 'Пул ID',
            dataIndex: 'id',
            width: 100
        },
        {
            text: 'Бот',
            dataIndex: 'bot',
            width: 150
        },
        {
            text: '№',
            width: 150,
            dataIndex: 'pid'
        },
        {
            text: 'Адрес',
            dataIndex: 'wallet',
            flex: 0.65
        },
        {
            text: 'Сумма',
            dataIndex: 'cryptoAmount',
            flex: 0.35
        },
        {
            width: 40,
            cell: {
                tools: {
                    remove: {
                        iconCls: 'x-fa fa-times-circle redColor',
                        handler: 'removeFromPool'
                    }
                }
            }
        }
    ]
})