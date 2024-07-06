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
                    width : 100,
                    menuDisabled: true,
                },
                {
                    text: 'Приложение',
                    dataIndex: 'app',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Заголовок',
                    dataIndex: 'title',
                    width: 250,
                    menuDisabled: true,
                },
                {
                    text: 'Сообщение',
                    dataIndex: 'message',
                    flex: 1,
                    menuDisabled: true,
                },
                {
                    text: 'Телефон',
                    dataIndex: 'phone',
                    width: 150,
                    menuDisabled: true,
                }
            ]
        }
    ]
})