Ext.define('Ticket.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    items: [
        {
            xtype: 'panel',

            title: 'Оформление тикета',
            titleAlign: 'center',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'fieldset',
                    margin: 5,
                    width: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    defaults: {
                        margin: '10 10 0 10'
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Опишите вашу проблему',
                            labelAlign: 'top',
                            width: '100%'
                        },
                        {
                            xtype: 'filefield',
                            labelAlign: 'right',
                            fieldLabel: 'Файл',
                            labelWidth: 40,
                            width: '100%'
                        },
                        {
                            xtype: 'button',
                            text: 'Ещё один файл',
                            iconCls: 'fas fa-plus',
                            width: 140
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Отправить тикет'
                }
            ]
        }
    ]
});