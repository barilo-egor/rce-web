Ext.define('Dashboard.view.audit.balance.BalanceAuditContainer', {
    extend: 'Ext.Container',
    xtype: 'balanceauditcontainer',


    layout: 'fit',
    items: [
        {
            xtype: 'panel',

            title: 'Изменения реферальных балансов пользователей',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            reference: 'balanceAuditSearchForm',
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            margin: '0 0 20 0',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Chat id',
                                    margin: '0 50 0 0',
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Chat id инициатора'
                                },
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Искать',
                            handler: function (me) {
                                Ext.getStore(VARS.STORE_IDS.BALANCE_AUDIT_STORE).load()
                            }
                        }
                    ]
                },
                {
                    flex: 1,
                    xtype: 'grid',

                    plugins: {
                        pagingtoolbar: true
                    },
                    store: VARS.STORE_IDS.BALANCE_AUDIT_STORE,

                    emptyText: 'Записи отсутствуют.',

                    listeners: {
                        painted: function (me) {
                            me.getStore().load()
                        }
                    },

                    columns: [
                        {
                            text: 'Дата, время',
                            dataIndex: 'dateTime',
                            width: 150
                        },
                        {
                            text: 'Chat id',
                            dataIndex: 'targetChatId',
                            width: 200
                        },
                        {
                            text: 'Тип изменения',
                            dataIndex: 'type',
                            flex: 1
                        },
                        {
                            text: 'Сумма изменения',
                            dataIndex: 'amount',
                            width: 200
                        },
                        {
                            text: 'Новое значение баланса',
                            dataIndex: 'newBalance',
                            width: 200
                        },
                        {
                            text: 'Chat id инициатора',
                            dataIndex: 'initiatorChatId',
                            width: 200
                        },
                        {
                            text: 'Роль инициатора',
                            dataIndex: 'initiatorRole',
                            flex: 1
                        }
                    ]
                }
            ]
        }
    ]
})