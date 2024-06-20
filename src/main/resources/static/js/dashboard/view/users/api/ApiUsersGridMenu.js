Ext.define('Dashboard.view.users.api.ApiUsersGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apiusersgridmenu',

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
                Ext.create('Ext.Dialog', {
                    reference: 'tieDialog',
                    closable: 'true',
                    title: 'Привязка WEB пользователя',
                    minWidth: 350,
                    width: '20%',

                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            reference: 'currentUserField',
                            label: 'Текущий WEB пользователь',
                            value: username,
                            defaultValue: username,
                            editable: false,
                            margin: '0 0 20 0',
                            listeners: {
                                change: function (me, newValue) {
                                    ExtUtil.referenceQuery('tieButton').setDisabled(newValue === me.defaultValue)
                                }
                            }
                        },
                        {
                            xtype: 'panel',
                            shadow: true,
                            height: 255,
                            margin: '0 0 30 0',

                            layout: 'fit',
                            tbar: {
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        filterId: 'userNameFilter',
                                        listeners: {
                                            change: function (me, newValue) {
                                                let store = Ext.getStore('userLoginStore')
                                                store.removeFilter(me.filterId)
                                                store.addFilter(new Ext.util.Filter({
                                                    id: me.filterId,
                                                    filterFn: function (item) {
                                                        return item.get('username').startsWith(newValue)
                                                    }
                                                }))
                                            }
                                        }
                                    }
                                ]
                            },
                            items: [
                                {
                                    xtype: 'list',
                                    itemTpl: '{username}',
                                    store: {
                                        storeId: 'userLoginStore',
                                        autoLoad: true,
                                        fields: [
                                            'username'
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url: '/util/getUsernames',
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    },
                                    listeners: {
                                        childdoubletap: function (me, location) {
                                            let username = me.getStore().getAt(location.recordIndex).get('username')
                                            ExtUtil.referenceQuery('currentUserField').setValue(username)
                                        }
                                    }
                                },
                            ]
                        },
                        {
                            xtype: 'button',
                            reference: 'tieButton',
                            text: 'Привязать',
                            disabled: true,
                            handler: function (me) {
                                let username = ExtUtil.referenceQuery('currentUserField').getValue()
                                let text = !username || username.length === 0
                                    ? 'У пользователя будет снята роль API клиента. Продолжить?'
                                    : 'Пользователю так же будет установлена роль API клиента,<br>если она ещё не установлена. Продолжить?'
                                ExtMessages.confirm('Привязка', text,
                                    function () {
                                        ExtUtil.mask('tieDialog')
                                        ExtUtil.mRequest({
                                            url: '/users/api/tie',
                                            loadingComponentRef: 'tieDialog',
                                            params: {
                                                apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid'),
                                                username: username
                                            },
                                            success: function (response) {
                                                Ext.getStore('apiUserStore').reload()
                                                ExtUtil.maskOff('tieDialog')
                                                ExtUtil.referenceQuery('tieDialog').close()
                                            }
                                        })
                                    })
                            }
                        }
                    ]
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
            text: 'Удалить',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                Ext.create('Dashboard.view.users.api.dialog.ApiUserDeleteDialog').show()
            }
        }
    ]
})