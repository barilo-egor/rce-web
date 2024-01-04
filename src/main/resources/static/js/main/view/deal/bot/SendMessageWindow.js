Ext.define('Main.view.deal.bot.SendMessageWindow', {
    extend: 'Ext.window.Window',
    autoShow: true,
    draggable: false,
    modal: true,
    bind: {
        title: 'Отправка сообщения пользователю {chatId}',
    },
    width: '90%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    defaults: {
        margin: '10 10 10 10'
    },
    items: [
        {
            xtype: 'textareafield',
            reference: 'messageTextField',
            fieldLabel: 'Сообщение',
            labelWidth: 75,
            validator: ValidatorUtil.validateNotEmpty
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Отправить',
                    cls: 'blueButton',
                    maxWidth: 200,
                    handler: function (btn) {
                        if (!ExtUtil.referenceQuery('messageTextField').isValid()) return
                        let chatId = btn.up('window').getViewModel().getData().chatId
                        ExtUtil.request({
                            url: '/web/deal/bot/sendMessage',
                            params: {
                                message: ExtUtil.referenceQuery('messageTextField').getValue(),
                                chatId: chatId
                            },
                            success: function (response) {
                                btn.up('window').close()
                            }
                        })
                    }
                }
            ]
        }
    ]
})