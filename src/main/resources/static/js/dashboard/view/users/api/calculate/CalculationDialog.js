Ext.define('Dashboard.view.users.api.calculate.CalculationDialog', {
    extend: 'Ext.Dialog',

    title: 'Расчёт клиента',
    titleAlign: 'center',
    closable: true,
    width: '30%',

    buttons: [
        {
            text: 'Подтвердить расчет'
        }
    ],
    buttonAlign: 'center',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'fieldset',
            title: 'Текущая крайняя сделка',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 0.5
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Номер сделки',
                    value: '123'
                },
                {
                    xtype: 'displayfield',
                    label: 'Дата и время',
                    value: '15.05.2024 12:12'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Предыдущая расчетная сделка',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 0.5
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Номер сделки',
                    value: '54'
                },
                {
                    xtype: 'displayfield',
                    label: 'Дата и время',
                    value: '18.04.2024 12:12'
                }
            ]
        }
    ]
})