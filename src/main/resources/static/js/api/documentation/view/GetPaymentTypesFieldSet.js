Ext.define('ApiDocumentation.view.GetPaymentTypesFieldSet', {
    extend: 'Ext.form.FieldSet',
    xtype: 'getpaymenttypesfieldset',

    title: 'Получение типов оплаты',
    collapsible: true,
    collapsed: true,
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
            html: 'Необходим в случае, если вы работаете по нескольким типам оплаты.<br>' +
                'Для получения типов оплаты необходимо отправить <b>GET</b> запрос.',
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
                                    me.setValue(response.data + '/api/10/getPaymentTypes')
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
                        description: 'Optional. Тип сделки: BUY - покупка, SELL - продажа'
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
            title: 'Пример ответа',
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
                    value:
                        '{\n' +
                        '   "code": 23,\n' +
                        '   "description": "Типы оплат найдены",\n' +
                        '   "data":[\n' +
                        '       {\n' +
                        '           "name": "Сбербанк",\n' +
                        '           "id": "sber",\n' +
                        '           "dealType": "BUY",\n' +
                        '           "fiatCurrency": "RUB",\n' +
                        '           "minSum": "150"\n' +
                        '       },\n' +
                        '       {\n' +
                        '           "name": "Тинькофф",\n' +
                        '           "id": "tinkoff",\n' +
                        '           "dealType": "SELL",\n' +
                        '           "fiatCurrency": "RUB",\n' +
                        '           "minSum": "200"\n' +
                        '       }\n' +
                        '   ]  \n' +
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
                    height: 95,
                    width: 400,
                    editable: false,
                    value: '{\n' +
                        '   "code": 21,\n' +
                        '   "description": "Типы оплат не найдены."\n' +
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
                    url: '/api/10/statusCodes/getPaymentTypes',
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
                        if (val === 23) {
                            return '<i class="fas fa-circle limeColor"></i>'
                        } else {
                            return '<i class="fas fa-circle redColor"></i>'
                        }
                    }
                }
            ]
        }
    ]
})