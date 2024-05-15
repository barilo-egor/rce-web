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
            columns: [
                {
                    text: 'Статус'
                },
                {
                    text: 'Тип оплаты'
                },
                {
                    text: 'Тип сделки'
                },
                {
                    text: 'Сумма в крипте'
                },
                {
                    text: 'Фиат сумма'
                },
                {
                    text: 'Доставка'
                },
                {
                    text: 'Дата'
                },
                {
                    text: 'Время'
                },
                {
                    text: 'Реквизит'
                },
                {
                    text: 'Chat id'
                }
            ]
        }
    ]
})