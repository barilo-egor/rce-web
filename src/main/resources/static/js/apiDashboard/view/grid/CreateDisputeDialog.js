Ext.define('ApiDashboard.view.grid.CreateDisputeDialog', {
    extend: 'Ext.Dialog',

    title: 'Создание диспута',
    closable: true,
    width: 750,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container',
                flex: 1,
                margin: '0 20 0 20',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
            },
            items: [
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Тип сделки'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Фиатная валюта'
                        }
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Криптовалюта'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Реквизит'
                        }
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Фиатная сумма'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Сумма в крипте'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'filefield',
            buttonText: 'Выбрать',
            label: 'Чек',
            width: '60%',
            hideLabel: true,
            reference: 'basicFile'
        },
        {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Создать'
        }
    ]
})