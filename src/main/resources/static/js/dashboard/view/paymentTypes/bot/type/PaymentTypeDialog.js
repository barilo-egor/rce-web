Ext.define('Dashboard.view.paymentTypes.bot.type.PaymentTypeDialog', {
    extend: 'Ext.Dialog',

    titleAlign: 'center',
    bind: {
        title: '{title}'
    },
    width: 400,

    buttons: [
        {
            text: 'Сохранить'
        }
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [

    ]
})