let ExtMessages = {
    incorrectlyForm: function () {
        Ext.Msg.alert('Внимание', 'Неверно заполнена форма.')
    },

    topToast: function (message) {
        Ext.toast({
            message: message,
            timeout: 3000,
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
                        me.up('dialog').setMasked('Пожалуйста, подождите.')
                        handler()
                        me.up('dialog').setMasked(false)
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
    },

    block: function (title, message) {
        Ext.create('Ext.Dialog', {
            title: title,
            closable: false,

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
    },

    error: function (title, message, handler) {
        Ext.create('Ext.Dialog', {
            title: title,
            closable: true,
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Ок',
                    handler: function (me) {
                        if (handler) handler()
                        else me.up('dialog').close()
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
    },

    info: function (title, message) {
        Ext.create('Ext.Dialog', {
            title: title,
            closable: true,
            buttonAlign: 'center',

            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'container',
                    margin: '0 40 20 40',
                    html: message
                }
            ]
        }).show()
    }
}