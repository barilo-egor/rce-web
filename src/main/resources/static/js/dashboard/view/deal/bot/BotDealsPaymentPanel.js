Ext.define('Dashboard.view.deal.bot.BotDealsPaymentPanel', {
    extend: 'Ext.Panel',
    xtype: 'botdealspaymentpanel',

    title: 'Оплаты',
    collapsible: ExtUtilConfig.getCollapsible('bottom'),
    height: '30%',


    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            store: Ext.create('Dashboard.store.deal.bot.DealPaymentStore'),
            listeners: {
                painted: function (me) {
                    me.getStore().load()
                }
            },
            columns: [
                {
                    text: 'Сделка',
                    dataIndex: 'deal.pid',
                    width : 100
                },
                {
                    text: 'Приложение',
                    dataIndex: 'app',
                    width: 150
                },
                {
                    text: 'Заголовок',
                    dataIndex: 'title',
                    width: 250,
                },
                {
                    text: 'Сообщение',
                    dataIndex: 'message',
                    flex: 1
                },
                {
                    text: 'Телефон',
                    dataIndex: 'phone',
                    width: 150
                }
            ]
        }
    ]
})