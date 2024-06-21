Ext.define('Dashboard.view.users.api.ApiUsersGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apiusersgridmenu',
    requires: [
        'Dashboard.view.users.api.tie.TieDialog',
        'Dashboard.view.users.api.calculations.CalculationsDialog'
    ],

    items: [
        {
            text: 'Скопировать ID',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('id'))
                ExtMessages.topToast('ID скопирован в буфер обмена')
            }
        },
        {
            text: 'Скопировать токен',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('token'))
                ExtMessages.topToast('Токен скопирован в буфер обмена')
            }
        },
        '-',
        {
            text: 'Привязать к WEB',
            iconCls: 'x-fa fa-user-tie material-blue-color',
            handler: function (me) {
                let username = ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('webUser')
                if (!username || username.length === 0) username = 'Не привязан'
                Ext.create('Dashboard.view.users.api.tie.TieDialog', {
                    viewModel: {
                        data: {
                            username: username
                        }
                    }
                }).show()
            }
        },
        {
            text: 'Расчет',
            iconCls: 'x-fa fa-calculator lightBlue',
            reference: 'calculationGridButton',
            handler: function (me) {
                Ext.create('Dashboard.view.users.api.calculate.CalculationDialog').show()
            }
        },
        {
            text: 'Предыдущие расчеты',
            iconCls: 'x-fa fa-file-invoice-dollar forestgreenColor',
            handler: function (me) {
                ExtUtil.mask('apiUsersContainer')
                ExtUtil.mRequest({
                    url: '/users/api/hasCalculations',
                    params: {
                        apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
                    },
                    loadingComponentRef: 'apiUsersContainer',
                    method: 'GET',
                    success: function (response) {
                        if (response.body.data.hasCalculations === false) {
                            ExtUtil.maskOff('apiUsersContainer')
                            ExtMessages.topToast('У пользователя отсутствуют расчёты.')
                            return
                        }
                        let store = Ext.getStore('calculationsStore')
                        store.load({
                            callback: function() {
                                Ext.create('Dashboard.view.users.api.calculations.CalculationsDialog', {
                                    viewModel: {
                                        data: {
                                            store: store
                                        }
                                    }
                                }).show()
                                ExtUtil.maskOff('apiUsersContainer')
                            }
                        })
                    }
                })
            }
        },
        {
            text: 'Удалить',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                Ext.create('Dashboard.view.users.api.dialog.ApiUserDeleteDialog').show()
            }
        }
    ]
})