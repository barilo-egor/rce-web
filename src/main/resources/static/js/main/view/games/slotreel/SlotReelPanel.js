Ext.define('Main.view.games.slotreel.SlotReelPanel', {
    xtype: 'slotreelpanel',
    extend: 'Main.view.components.FramePanel',
    reference: 'slotReelPanel',
    requires: [
        // 'Main.view.webUser.control.WebUserControlController'
    ],
    title: {
        xtype: 'mainframetitle',
        text: 'Управление игрой "Барабан"'
    },
    // controller: 'webUserControlController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforerender: function (me) {
            ExtUtil.request({
                async: false,
                method: 'GET',
                url: '/web/properties/getPropertiesValues',
                params: {
                    propertiesPath: 'SLOT_REEL_PROPERTIES',
                    keys: [
                        'try',
                        'seven.triple', 'seven.double',
                        'lemon.triple', 'lemon.double',
                        'cherry.triple', 'cherry.double',
                        'bar.triple', 'bar.double',
                        'button.try.text', 'button.close.text'
                    ]
                },
                success: function (response) {
                    let data = response.body.data
                    for (let entry of data) {
                        let field = ExtUtil.referenceQuery(entry.key + '-field')
                        field.setValue(entry.value)
                        field.defaultValue = entry.value
                    }
                }
            })
            ExtUtil.request({
                async: false,
                method: 'GET',
                url: '/web/properties/getPropertiesValues',
                params: {
                    propertiesPath: 'SLOT_REEL_MESSAGE',
                    keys: [
                        'scroll', 'win', 'lose', 'start', 'balance.empty', 'try.cost'
                    ]
                },
                success: function (response) {
                    let data = response.body.data
                    for (let entry of data) {
                        let field = ExtUtil.referenceQuery(entry.key + '-field')
                        field.setValue(entry.value)
                        field.defaultValue = entry.value
                    }
                }
            })
        }
    },

    defaults: {
        margin: '0 20 0 20'
    },
    items: [
        {
            xtype: 'numberfield',
            reference: 'try-field',
            fieldLabel: 'Сумма за попытку',
            hideTrigger: true,
            labelAlign: 'right',
            labelWidth: 120
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
                        xtype: 'numberfield'
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
            reference: 'button.try.text-field',
            fieldLabel: 'Кнопка прокрута',
            labelAlign: 'right',
            labelWidth: 140,
            margin: '10 0 0 0'
        },
        {
            xtype: 'textfield',
            reference: 'button.close.text-field',
            fieldLabel: 'Кнопка закрытия',
            labelAlign: 'right',
            labelWidth: 140,
            margin: '10 0 0 0'
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

        }
    ]
})