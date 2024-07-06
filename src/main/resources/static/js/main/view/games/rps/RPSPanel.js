Ext.define('Main.view.games.rps.RPSPanel', {
    xtype: 'rpspanel',
    extend: 'Main.view.components.FramePanel',
    reference: 'rpsPanel',
    title: {
        xtype: 'mainframetitle',
        text: 'Управление игрой "КНБ"'
    },
    requires: [
        'Main.view.games.rps.RPSController'
    ],
    controller: 'rpsController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    gameProperties: {
        configPropertiesPath: 'RPS_PROPERTIES',
        messagePropertiesPath: 'RPS_MESSAGE',
        configKeys: ['button.text', 'sums'],
        messageKeys: ['start', 'referral.balance', 'select.rate', 'win.sum', 'rock', 'paper', 'scissors',
            'ask', 'win', 'lose', 'draw']
    },

    listeners: {
        beforerender: 'beforerender'
    },

    defaults: {
        margin: '10 20 0 20',
        listeners: {
            change: 'change'
        }
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
            collapsible: true,
            collapsed: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textarea',
                listeners: {
                    change: 'change'
                }
            },
            items: [
                {
                    fieldLabel: 'Стартовое сообщение',
                    reference: 'start-field'
                },
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
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Сохранить',
                    cls: 'blueButton',
                    handler: 'saveButtonClick',
                    margin: '0 0 20 0'
                }
            ]
        }
    ]
})