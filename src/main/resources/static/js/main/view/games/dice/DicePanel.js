Ext.define('Main.view.games.dice.DicePanel', {
    xtype: 'dicepanel',
    extend: 'Main.view.components.FramePanel',
    reference: 'rpsPanel',
    title: {
        xtype: 'mainframetitle',
        text: 'Управление игрой "Кости"'
    },
    requires: [
        'Main.view.games.dice.DiceController'
    ],
    controller: 'diceController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    gameProperties: {
        configPropertiesPath: 'DICE_PROPERTIES',
        messagePropertiesPath: 'DICE_MESSAGE',
        configKeys: ['DICE', 'button.try.text', 'button.close.text', 'button.back.text', 'sums'],
        messageKeys: ['roll', 'win', 'lose', 'start', 'start.rules', 'balance.empty', 'selected.number', 'selected.bet', 'referral.balance']
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
            reference: 'DICE-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Кнопка попытки',
            reference: 'button.try.text-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Кнопка закрытия',
            reference: 'button.close.text-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Кнопка назад',
            reference: 'button.back.text-field'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Суммы через запятую',
            reference: 'sums-field'
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
                    fieldLabel: 'Бросок',
                    reference: 'roll-field'
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
                    fieldLabel: 'Стартовое',
                    reference: 'start-field'
                },
                {
                    fieldLabel: 'Стартовое, правила',
                    reference: 'start.rules-field'
                },
                {
                    fieldLabel: 'Запрос сумму на утроение',
                    reference: 'start.triple.sum-field'
                },
                {
                    fieldLabel: 'Недостаточный баланс',
                    reference: 'balance.empty-field'
                },
                {
                    fieldLabel: 'Число игрока',
                    reference: 'selected.number-field'
                },
                {
                    fieldLabel: 'Выбранная ставка игрока',
                    reference: 'selected.bet-field'
                },
                {
                    fieldLabel: 'Текущий баланс игрока',
                    reference: 'referral.balance-field'
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