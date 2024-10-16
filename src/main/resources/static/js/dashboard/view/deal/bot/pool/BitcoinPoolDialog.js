Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolDialog', {
    extend: 'Ext.Dialog',
    reference: 'bitcoinPoolDialog',
    requires: [
        'Dashboard.view.deal.bot.pool.BitcoinPoolGrid',
        'Dashboard.view.deal.bot.pool.BitcoinPoolController'
    ],
    controller: 'bitcoinPoolController',

    title: 'Пул BTC сделок',
    closable: true,
    width: 800,
    height: 500,
    emptyText: 'Сделки отсутствуют',

    layout: {
        type: 'vbox',
        align: 'right'
    },

    listeners: {
        show: 'show',
        destroy: 'destroy'
    },

    buttons: [
        {
            xtype: 'button',
            text: 'Автовывод'
        },
        {
            xtype: 'button',
            text: 'Очистить пул',
            handler: 'clearPool'
        }
    ],
    items: [
        {
            xtype: 'bitcoinpoolgrid',
            flex: 1,
            width: '100%'
        },
        {
            xtype: 'panel',
            reference: 'bitcoinPoolTotalContainer',
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'textfield',
                readOnly: true,
                clearable: false,
                margin: '0 15 0 0',
                width: 120
            },
            items: [
                {
                    reference: 'dealPoolSizeField',
                    label: 'Количество сделок'
                },
                {
                    reference: 'dealPoolSumField',
                    label: 'Общая сумма',
                }
            ]
        }
    ]
})