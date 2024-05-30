Ext.define('Dashboard.view.users.web.WebUsersContainer', {
    extend: 'Ext.Container',
    xtype: 'webuserscontainer',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    padding: '10 10 10 10',

    items: [
        {
            flex: 1,
            xtype: 'grid',
            reference: 'webUsersGrid',
            shadow: true,
            store: Ext.create('Dashboard.store.users.web.WebUserStore'),

            plugins: {
                gridcellediting: {
                    selectOnEdit: true
                }
            },

            columns: [
                {
                    text: 'Логин',
                    dataIndex: 'username',
                    editable: true,
                    flex: 0.25,
                    editor: {
                        clearable: false,
                        validators: ValidatorUtil.validateLogin,
                        listeners: {
                            keydown: function (field, e) {
                                if (e.keyCode === Ext.event.Event.ENTER) {
                                    if (field.validate()) {
                                        ExtUtil.mRequest({
                                            url: '/users/web/updateUsername',
                                            params: {
                                                pid: ExtUtil.referenceQuery('webUsersGrid').getSelection().get('pid'),
                                                username: field.getValue()
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    text: 'Роль',
                    dataIndex: 'role',
                    flex: 0.25,
                    editable: true,
                    renderer: function (val) {
                        return val.displayName
                    },
                    editor: {
                        xtype: 'combobox',
                        data: ['qwe','asd']
                    }
                },
                {
                    text: 'В бане',
                    dataIndex: 'isEnabled',
                    flex: 0.25,
                    renderer: function (val) {
                        return val ? 'Нет' : 'Да'
                    }
                },
                {
                    text: 'Chat id',
                    flex: 0.25,
                    dataIndex: 'chatId'
                }
            ]
        }
    ]
})