Ext.define('ApiDocumentation.view.CalculateDealFieldSet', {
    extend: 'Ext.form.FieldSet',
    xtype: 'calculatedealfieldset',

    title: 'Расчёт суммы',
    collapsible: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        margin: '0 0 10 0'
    },
    items: [
        {
            xtype: 'component',
            html: 'Для расчёта необходимо отправить <b>GET</b> запрос.<br> ' +
                'Сумма отправляется либо в фиате (<b>amount</b>), либо в криптовалюте (<b>cryptoAmount</b>).',
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 1,
                    xtype: 'textfield',
                    listeners: {
                        afterrender: function (me) {
                            ExtUtil.request({
                                url: '/api/10/getUrl',
                                method: 'GET',
                                success: function (response) {
                                    me.setValue(response.data + '/api/10/calculate')
                                }
                            })
                        }
                    },
                    editable: false,
                    fieldLabel: 'URL',
                    labelWidth: 30
                },
                {
                    xtype: 'button',
                    width: 120,
                    text: 'Скопировать',
                    handler: function (btn) {
                        navigator.clipboard.writeText(btn.up('container').items.items[0].getValue())
                        Ext.toast('Ссылка скопирована в буфер обмена.')
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            title: 'Параметры',
            collapsible: true,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    'name', 'type', 'description'
                ],
                data: [
                    {
                        name: 'token',
                        type: 'String',
                        description: 'Ваш api-токен'
                    },
                    {
                        name: 'dealType',
                        type: 'String',
                        description: 'Тип сделки: BUY - покупка, SELL - продажа'
                    },
                    {
                        name: 'fiatCurrency',
                        type: 'String',
                        description: API_DOCUMENTATION_VARIABLES.fiats
                    },
                    {
                        name: 'cryptoCurrency',
                        type: 'String',
                        description: 'Криптовалюта: BITCOIN, LITECOIN, USDT, MONERO'
                    },
                    {
                        name: 'amount',
                        type: 'Decimal',
                        description: 'Сумма в фиате'
                    },
                    {
                        name: 'cryptoAmount',
                        type: 'Decimal',
                        description: 'Сумма к криптовалюте'
                    }
                ]
            }),
            columns: [
                {
                    width: 150,
                    text: 'Параметр',
                    dataIndex: 'name'
                },
                {
                    width: 100,
                    text: 'Тип',
                    dataIndex: 'type'
                },
                {
                    flex: 1,
                    text: 'Описание',
                    dataIndex: 'description'
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Пример ответа в случае, расчёт произведен успешно.',
            collapsible: true,
            collapsed: true,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textarea',
                    padding: '10 0 0 0',
                    height: 215,
                    width: 400,
                    editable: false,
                    value: '{\n' +
                        '   "code": 19,\n' +
                        '   "description": "Расчёт произведен.",\n' +
                        '   "data":{\n' +
                        '      "amountToPay": "5000",\n' +
                        '      "cryptoAmount": "0.00217"\n' +
                        '   }\n' +
                        '}'
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Пример ответа в случае ошибки',
            collapsible: true,
            collapsed: true,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textarea',
                    padding: '10 0 0 0',
                    height: 175,
                    width: 400,
                    editable: false,
                    value: '{\n' +
                        '   "code": 14,\n' +
                        '   "description": "Получившаяся сумма меньше минимально требуемой.",\n' +
                        '   "data":{\n' +
                        '      "minSum": "0.001"\n' +
                        '   }\n' +
                        '}'
                }
            ]
        },
        {
            xtype: 'grid',
            title: 'Коды ответа',
            collapsible: true,
            collapsed: true,
            store: Ext.create('Ext.data.Store', {
                fields: ['code', 'description'],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/api/10/statusCodes/calculate',
                    reader: {
                        type: 'json',
                        rootProperty: 'body.data'
                    }
                }
            }),
            columns: [
                {
                    width: 50,
                    text: 'Код',
                    dataIndex: 'code'
                },
                {
                    flex: 1,
                    text: 'Описание',
                    dataIndex: 'description'
                },
                {
                    width: 35,
                    dataIndex: 'code',
                    renderer: function (val) {
                        if (val !== 19) {
                            return '<i class="fas fa-circle redColor"></i>'
                        } else {
                            return '<i class="fas fa-circle limeColor"></i>'
                        }
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            title: 'Данные расчёта',
            collapsed: true,
            collapsible: true,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    'field', 'description'
                ],
                data: [
                    {
                        field: 'amountToPay',
                        description: 'Сумма к оплате.'
                    },
                    {
                        field: 'cryptoAmount',
                        description: 'Сумма криптовалюты к получению (для продажи).'
                    },
                    {
                        field: 'amount',
                        description: 'Сумма в фиате к получению (для покупки).'
                    }
                ]
            }),
            columns: [
                {
                    width: 150,
                    text: 'Поле',
                    dataIndex: 'field'
                },
                {
                    flex: 1,
                    text: 'Описание',
                    dataIndex: 'description'
                }
            ]
        }
    ]
})