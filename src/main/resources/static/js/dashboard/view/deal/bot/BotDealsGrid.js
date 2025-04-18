Ext.define('Dashboard.view.deal.bot.BotDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'botdealsgrid',
    reference: 'botDealsGrid',

    requires: [
        'Dashboard.view.deal.bot.BotDealsController',
        'Dashboard.view.deal.bot.BotDealsGridMenu',
        'Dashboard.view.deal.bot.add.AddDialog',
        'Dashboard.view.deal.bot.pool.BitcoinPoolDialog',
        'Dashboard.view.deal.bot.ChangeWalletWindow',
        'Dashboard.view.deal.bot.ChangeCommissionDialog'
    ],
    controller: 'botDealsController',

    flex: 1,
    shadow: true,
    margin: '5 5 10 10',
    layout: 'fit',
    items: [
        {
            xtype: 'toolbar',
            docked: 'top',

            items: [
                {
                    iconCls: 'x-fa fa-sync-alt',
                    tooltip: 'Перезагрузить сделки',
                    handler: 'reloadDeals'
                },
                {
                    iconCls: 'x-fa fa-plus forestgreenColor',
                    tooltip: 'Добавление ручных сделок',
                    handler: 'manualAddDeal'
                },
                {
                    iconCls: 'x-fa fa-file-excel darkGreen',
                    tooltip: 'Экспорт сделок в Excel',
                    handler: 'exportDeals'
                },
                {
                    xtype: 'component',
                    html: '|',
                    style: {
                        'margin-left': '10px',
                        'margin-right': '10px',
                        'color': 'gray'
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'dealRequestGroupField',
                    label: 'Группа запросов',
                    labelAlign: 'left',
                    labelWidth: 110,
                    width: 280,
                    clearable: false,
                    editable: false,
                    tooltip: 'Группа, в которую отправляются запросы на вывод сделок.',
                    triggers: {
                        change: {
                            iconCls: 'x-fa fa-wrench material-blue-color',
                            handler: function (me) {
                                Ext.create('Dashboard.view.deal.bot.DealRequestGroupDialog').show()
                            }
                        }
                    },
                    listeners: {
                        painted: function (me) {
                            ExtUtil.mRequest({
                                url: '/deal/bot/getDealRequestGroup',
                                method: 'GET',
                                success: function (response) {
                                    me.setValue(response.body.data.title)
                                    me.groupPid = response.body.data.pid
                                }
                            })
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'autoWithdrawalGroupField',
                    label: 'Группа автовыводов',
                    labelAlign: 'left',
                    labelWidth: 130,
                    width: 280,
                    margin: '0 0 0 15',
                    clearable: false,
                    editable: false,
                    tooltip: 'Группа, в которую отправляются сделки после автовывода.',
                    triggers: {
                        change: {
                            iconCls: 'x-fa fa-wrench material-blue-color',
                            handler: function (me) {
                                Ext.create('Dashboard.view.deal.bot.AutoWithdrawalGroupDialog').show()
                            }
                        }
                    },
                    listeners: {
                        painted: function (me) {
                            ExtUtil.mRequest({
                                url: '/deal/bot/getAutoWithdrawalGroup',
                                method: 'GET',
                                success: function (response) {
                                    me.setValue(response.body.data.title)
                                    me.groupPid = response.body.data.pid
                                }
                            })
                        }
                    }
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'top',

            items: [
                {
                    xtype: 'textfield',
                    reference: 'litecoinBalanceField',
                    label: 'LTC баланс',
                    labelAlign: 'left',
                    labelWidth: 85,
                    width: 250,
                    clearable: false,
                    editable: false,
                    reload: function () {
                        let me = this
                        ExtUtil.mRequest({
                            url: '/deal/bot/getBalance/LITECOIN',
                            method: 'GET',
                            success: function (response) {
                                if (response.body.data.value === false) {
                                    me.setHidden(true)
                                } else {
                                    me.setValue(response.body.data.value)
                                }
                            }
                        })
                    },
                    listeners: {
                        painted: function (me) {
                            me.reload()
                        }
                    },
                    triggers: {
                        change: {
                            iconCls: 'x-fa fa-wrench material-blue-color',
                            handler: function (me) {
                                Ext.create('Dashboard.view.deal.bot.ChangeWalletWindow', {
                                    viewModel: {
                                        data: {
                                            title: 'Замена LTC кошелька',
                                            cryptoCurrency: 'LITECOIN'
                                        }
                                    }
                                }).show()
                            }
                        },
                        update: {
                            iconCls: 'x-fa fa-sync-alt material-blue-color',
                            handler: function (me) {
                                me.reload()
                                ExtMessages.topToast('Значение LTC баланса перезагружено')
                            }
                        }
                    }
                },
                {
                    xtype: 'component',
                    html: '|',
                    style: {
                        'margin-left': '10px',
                        'margin-right': '10px',
                        'color': 'gray'
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'bitcoinBalanceField',
                    label: 'BTC баланс',
                    labelAlign: 'left',
                    labelWidth: 85,
                    width: 250,
                    clearable: false,
                    editable: false,
                    margin: '0 0 0 10',
                    reload: function () {
                        let me = this
                        ExtUtil.mRequest({
                            url: '/deal/bot/getBalance/BITCOIN',
                            method: 'GET',
                            success: function (response) {
                                if (response.body.data.value === false) {
                                    me.setHidden(true)
                                } else {
                                    me.setValue(response.body.data.value)
                                }
                            }
                        })
                    },
                    listeners: {
                        painted: function (me) {
                            me.reload()
                        }
                    },
                    triggers: {
                        change: {
                            iconCls: 'x-fa fa-wrench material-blue-color',
                            handler: function (me) {
                                Ext.create('Dashboard.view.deal.bot.ChangeWalletWindow', {
                                    viewModel: {
                                        data: {
                                            title: 'Замена BTC кошелька',
                                            cryptoCurrency: 'BITCOIN'
                                        }
                                    }
                                }).show()
                            }
                        },
                        update: {
                            iconCls: 'x-fa fa-sync-alt material-blue-color',
                            handler: function (me) {
                                me.reload()
                                ExtMessages.topToast('Значение BTC баланса перезагружено')
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'bitcoinCommissionField',
                    label: 'Комиссия BTC sat/byte',
                    labelAlign: 'left',
                    labelWidth: 120,
                    width: 200,
                    clearable: false,
                    editable: false,
                    margin: '0 0 0 10',
                    reload: function () {
                        let me = this
                        ExtUtil.mRequest({
                            url: '/deal/bot/getFeeRate/BITCOIN',
                            method: 'GET',
                            success: function (response) {
                                me.setValue(response.data)
                            }
                        })
                    },
                    listeners: {
                        painted: function (me) {
                            me.reload()
                        }
                    },
                    triggers: {
                        change: {
                            iconCls: 'x-fa fa-wrench material-blue-color',
                            handler: function (me) {
                                Ext.create('Dashboard.view.deal.bot.ChangeCommissionDialog', {
                                    viewModel: {
                                        data: {
                                            title: 'Обновление значения комиссии',
                                            cryptoCurrency: 'BITCOIN',
                                            value: me.getValue()
                                        }
                                    }
                                }).show()
                            }
                        },
                        update: {
                            iconCls: 'x-fa fa-sync-alt material-blue-color',
                            handler: function (me) {
                                me.reload()
                                ExtMessages.topToast('Значение комиссии перезагружено')
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'bitcoinPoolButton',
                    iconCls: 'x-fa fa-clipboard-list',
                    tooltip: 'Пул сделок на автовывод',
                    margin: '0 0 0 10',
                    handler: function () {
                        Ext.create('Dashboard.view.deal.bot.pool.BitcoinPoolDialog').show()
                    }
                },
                {
                    xtype: 'component',
                    html: '|',
                    style: {
                        'margin-left': '10px',
                        'margin-right': '10px',
                        'color': 'gray'
                    }
                },
            ]
        },
        {
            xtype: 'grid',
            reference: 'botDealsGrid',
            store: Ext.create('Dashboard.store.deal.bot.BotDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: 'openGridMenu',
                select: 'selectDeal',
                painted: 'loadStore'
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Статус',
                    dataIndex: 'dealStatus',
                    width: 180,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val) {
                        return '<span class="' + val.color + '">' + val.displayName + '</span>'
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType.name',
                    flex: 0.6,
                    menuDisabled: true,
                },
                {
                    text: 'Username',
                    width: 150,
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.username
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Курс',
                    dataIndex: 'course',
                    width: 80,
                    menuDisabled: true
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount',
                    menuDisabled: true,
                },
                {
                    text: 'Доставка',
                    dataIndex: 'deliveryType',
                    menuDisabled: true,
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'wallet',
                    flex: 1,
                    menuDisabled: true,
                }
            ]
        }
    ]
})