Ext.define('Dashboard.view.deal.bot.ChangeWalletWindow', {
    extend: 'Ext.Dialog',

    bind: {
        title: '{title}'
    },

    minWidth: 600,
    closable: true,

    buttons: [
        {
            text: 'Заменить',
            handler: function (me) {
            }
        }
    ],

    layout: 'fit',
    items: [
        {
            xtype: 'container',

            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Сид фраза',
                    inputType: 'password',
                    width: '90%'
                }
            ]
        }
    ]
})