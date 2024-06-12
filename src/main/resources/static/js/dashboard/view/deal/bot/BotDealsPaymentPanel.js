Ext.define('Dashboard.view.deal.bot.BotDealsPaymentPanel', {
    extend: 'Ext.Panel',
    xtype: 'botdealspaymentpanel',

    title: 'Оплаты',
    collapsible: ExtUtilConfig.getCollapsible('bottom'),
    collapsed: true,
    height: '30%',

    layout: 'fit',
    items: [
        {
            xtype: 'grid',

            columns: [
                {
                    text: 'Сделка',
                    width : 100
                },
                {
                    text: 'Приложение',
                    width: 150
                },
                {
                    text: 'Заголовок',
                    width: 250,
                },
                {
                    text: 'Сообщение',
                    flex: 1
                },
                {
                    text: 'Телефон',
                    width: 150
                }
            ]
        }
    ]
})