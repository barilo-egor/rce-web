let ExtMessages = {
    incorrectlyForm: function () {
        Ext.Msg.alert('Внимание', 'Неверно заполнена форма.')
    },

    topToast: function (message) {
        Ext.toast({
            message: message,
            alignment: 't-t'
        })
    },

    confirm: function (title, message, handler) {
        Ext.create('Ext.Dialog', {
            title: title,
            closable: true,
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Да',
                    handler: function (me) {
                        handler()
                        me.up('dialog').close()
                    }
                },
                {
                    text: 'Нет',
                    handler: function (me) {
                        me.up('dialog').close()
                    }
                }
            ],

            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'container',
                    html: message
                }
            ]
        }).show()
    }
}