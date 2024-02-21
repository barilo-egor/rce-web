Ext.define('Main.view.games.rps.RPSPanel', {
    xtype: 'rpspanel',
    extend: 'Main.view.components.FramePanel',
    reference: 'rpsPanel',
    // requires: [
    //     'Main.view.games.rps.RPSController'
    // ],
    title: {
        xtype: 'mainframetitle',
        text: 'Управление игрой "КНБ"'
    },
    // controller: 'rpsController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforerender: 'beforerender'
    },

    defaults: {
        margin: '10 20 0 20'
    },
    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Кнопка в меню',
            reference: 'button.text-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Суммы через запятую',
            reference: 'sums-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Камень',
            reference: 'rock-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Ножницы',
            reference: 'paper-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Бумага',
            reference: 'scissors-field'
        },
        {
            xtype: 'fieldset',
            title: 'Сообщения',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textarea'
            },
            items: [
                {
                    fieldLabel: 'Текущий баланс',
                    reference: 'referral.balance-field'
                },
                {
                    fieldLabel: 'Выбор ставки',
                    reference: 'select.rate-field'
                },
                {
                    fieldLabel: 'Сообщение о сумме выигрыша',
                    reference: 'win.sum-field'
                },
                {
                    fieldLabel: 'Выбор знака',
                    reference: 'ask-field'
                },
                {
                    fieldLabel: 'Выигрыш',
                    reference: 'win-field'
                },
                {
                    fieldLabel: 'Проигрыш',
                    reference: 'lose-field'
                },
                {
                    fieldLabel: 'Ничья',
                    reference: 'draw-field'
                },
            ]
        }
    ]
})