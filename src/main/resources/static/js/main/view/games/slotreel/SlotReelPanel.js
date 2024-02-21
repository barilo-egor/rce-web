Ext.define('Main.view.games.slotreel.SlotReelPanel', {
    xtype: 'slotreelpanel',
    extend: 'Main.view.components.FramePanel',
    reference: 'slotReelPanel',
    requires: [
        'Main.view.games.slotreel.SlotReelController'
    ],
    title: {
        xtype: 'mainframetitle',
        text: 'Управление игрой "Барабан"'
    },
    controller: 'slotReelController',
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
            xtype: 'numberfield',
            reference: 'try-field',
            fieldLabel: 'Сумма за попытку',
            hideTrigger: true,
            labelAlign: 'right',
            labelWidth: 120,
            listeners: {
                change: 'change'
            }
        },
        {
            xtype: 'fieldset',
            title: 'Суммы призов',
            collapsible: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Тройные комбинации',
                    collapsible: true,
                    defaults: {
                        hideTrigger: true,
                        labelAlign: 'right',
                        labelWidth: 40,
                        xtype: 'numberfield',
                        listeners: {
                            change: 'change'
                        }
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            fieldLabel: '7️⃣',
                            reference: 'seven.triple-field',
                        },
                        {
                            fieldLabel: '🍋',
                            reference: 'lemon.triple-field',
                        },
                        {
                            fieldLabel: '🍒',
                            reference: 'cherry.triple-field',
                        },
                        {
                            fieldLabel: 'BAR',
                            reference: 'bar.triple-field',
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    collapsible: true,
                    title: 'Двойные комбинации',
                    defaults: {
                        hideTrigger: true,
                        labelAlign: 'right',
                        labelWidth: 40,
                        xtype: 'numberfield',
                        listeners: {
                            change: 'change'
                        }
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            fieldLabel: '7️⃣',
                            reference: 'seven.double-field',
                        },
                        {
                            fieldLabel: '🍋',
                            reference: 'lemon.double-field',
                        },
                        {
                            fieldLabel: '🍒',
                            reference: 'cherry.double-field',
                        },
                        {
                            fieldLabel: 'BAR',
                            reference: 'bar.double-field',
                        }
                    ]
                },
            ]
        },
        {
            xtype: 'textfield',
            reference: 'SLOT_REEL-field',
            fieldLabel: 'Кнопка в меню',
            labelAlign: 'right',
            labelWidth: 140,
            listeners: {
                change: 'change'
            }
        },
        {
            xtype: 'textfield',
            reference: 'button.try.text-field',
            fieldLabel: 'Кнопка прокрута',
            labelAlign: 'right',
            labelWidth: 140,
            listeners: {
                change: 'change'
            }
        },
        {
            xtype: 'textfield',
            reference: 'button.close.text-field',
            fieldLabel: 'Кнопка закрытия',
            labelAlign: 'right',
            labelWidth: 140,
            listeners: {
                change: 'change'
            }
        },
        {
            xtype: 'fieldset',
            title: 'Сообщения',
            collapsible: true,
            collapsed: true,
            defaults: {
                labelAlign: 'right',
                labelWidth: 100,
                xtype: 'textarea',
                listeners: {
                    change: 'change'
                }
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    fieldLabel: 'Прокрут',
                    reference: 'scroll-field'
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
                    fieldLabel: 'Старт игры',
                    reference: 'start-field'
                },
                {
                    fieldLabel: 'Пустой баланс',
                    reference: 'balance.empty-field'
                },
                {
                    fieldLabel: 'Сумма попытки',
                    reference: 'try.cost-field'
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