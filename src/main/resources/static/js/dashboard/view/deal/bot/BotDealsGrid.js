Ext.define('Dashboard.view.deal.bot.BotDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'botdealsgrid',
    flex: 1,
    shadow: true,
    margin: '10 10 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-file-excel darkGreen'
            }
        ]
    },
    items: [
        {
            xtype: 'grid',
            store: Ext.create('Dashboard.store.deal.bot.BotDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            columns: [
                {
                    text: 'Статус',
                    dataIndex: 'status.displayName'
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType'
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType.displayName'
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount'
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount'
                },
                {
                    text: 'Доставка',
                    dataIndex: 'deliveryType'
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime'
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'requisite'
                },
                {
                    text: 'Chat id',
                    dataIndex: 'user.chatId'
                }
            ]
        }
    ]
})