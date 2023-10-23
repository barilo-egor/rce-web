Ext.define('Main.view.deal.bot.DeleteDealWindow', {
    extend: 'Ext.window.Window',
    requires: ['Main.view.deal.bot.BotDealsController'],
    controller: 'botDealsController',
    width: 300,
    title: 'Удаление сделки',
    autoShow: true,
    modal: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            margin: '10 0 10 0',
            html: 'Вы действительно хотите удалить сделку?'
        },
        {
            xtype: 'checkbox',
            fieldLabel: 'Забанить пользователя',
            id: 'banUserCheckbox',
            labelWidth: 150
        },
        {
            xtype: 'container',
            defaults: {
                xtype: 'button',
            },
            margin: '0 0 10 0',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    text: 'Удалить',
                    cls: 'redButton',
                    margin: '0 5 0 0',
                    handler: 'deleteDeal'
                },
                {
                    text: 'Отмена',
                    cls: 'blueButton',
                    handler: ExtUtil.closeWindow
                }
            ]
        }
    ]
})