Ext.define('Dashboard.view.users.web.WebUsersContainer', {
    extend: 'Ext.Container',
    xtype: 'webuserscontainer',
    reference: 'webUsersContainer',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            flex: 1,
            xtype: 'grid',
            reference: 'webUsersGrid',
            scrollable: true,
            shadow: true,
            margin: '10 5 10 10',
            store: Ext.create('Dashboard.store.users.web.WebUserStore'),

            listeners: {
                select: function (me, selected) {
                    me.setMasked('Загрузка')
                    ExtUtil.referenceQuery('webUserInfoPanel').expand()
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
                    ExtUtil.referenceQuery('userFieldsContainer').setHidden(false)
                    let user = selected[0].getData()

                    let usernameField = ExtUtil.referenceQuery('usernameField')
                    usernameField.defaultValue = user.username
                    usernameField.setValue(user.username)
                    let roleField = ExtUtil.referenceQuery('roleField')
                    let role = roleField.getStore().getRange().filter(role => role.get('name') === user.role.name)[0]
                    roleField.defaultValue = role.get('name')
                    roleField.setValue(role)
                    let isBannedField = ExtUtil.referenceQuery('isBannedField')
                    isBannedField.defaultValue = !user.isEnabled
                    isBannedField.setValue(!user.isEnabled)
                    let chatIdField = ExtUtil.referenceQuery('chatIdField')
                    chatIdField.defaultValue = user.chatId
                    chatIdField.setValue(user.chatId)

                    me.setMasked(false)
                },
                deselect: function () {
                    ExtUtil.referenceQuery('userFieldsContainer').setHidden(true)
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(false)
                }
            },

            columns: [
                {
                    text: 'Логин',
                    dataIndex: 'username',
                    flex: 0.25
                },
                {
                    text: 'Роль',
                    dataIndex: 'role',
                    flex: 0.25,
                    editable: true,
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    text: 'В бане',
                    dataIndex: 'isEnabled',
                    flex: 0.25,
                    editable: true,
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
        },
        {
            xtype: 'panel',
            reference: 'webUserInfoPanel',
            margin: '10 10 10 5',
            docked: 'right',
            collapsed: true,
            title: 'Пользователь',
            shadow: true,
            collapsible: {
                direction: 'right'
            },
            listeners: {
                expand: function (me) {
                    me.setModal(true)
                }
            },
            items: [
                {
                    xtype: 'container',
                    reference: 'chooseDealContainer',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'middle'
                    },
                    items: [
                        {
                            xtype: 'component',
                            html: 'Выберите пользователя'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    reference: 'userFieldsContainer',
                    hidden: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        width: 200,
                        margin: '0 20 0 20'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Username',
                            reference: 'usernameField',
                            clearable: false,
                            validators: function (val) {
                                if (val === this.defaultValue) return true
                                return ValidatorUtil.validateLogin(val)
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    ExtUtil.referenceQuery('updateButton').updateDisable()
                                }
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'Роль',
                            reference: 'roleField',
                            displayField: 'displayName',
                            valueField: 'name',
                            editable: false,
                            store: {
                                type: 'roleStore'
                            },
                            queryMode: 'local',
                            listeners: {
                                change: function (me, newValue) {
                                    ExtUtil.referenceQuery('updateButton').updateDisable()
                                }
                            }
                        },
                        {
                            xtype: 'togglefield',
                            label: 'В бане',
                            reference: 'isBannedField',
                            listeners: {
                                change: function (me, newValue) {
                                    ExtUtil.referenceQuery('updateButton').updateDisable()
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            label: 'Chat id',
                            reference: 'chatIdField',
                            clearable: false,
                            validators: function (val) {
                                if (val === this.defaultValue) return true
                                return ValidatorUtil.validateChatId(val)
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    ExtUtil.referenceQuery('updateButton').updateDisable()
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Обновить',
                            reference: 'updateButton',
                            disabled: true,
                            margin: '30 20 0 20',
                            updateDisable: function () {
                                let usernameField = ExtUtil.referenceQuery('usernameField')
                                let roleField = ExtUtil.referenceQuery('roleField')
                                let isBannedField = ExtUtil.referenceQuery('isBannedField')
                                let chatIdField = ExtUtil.referenceQuery('chatIdField')
                                if (!(usernameField.defaultValue && roleField.defaultValue
                                    && typeof isBannedField.defaultValue !== 'undefined' && chatIdField.defaultValue)) return
                                if ((usernameField.getValue() === usernameField.defaultValue
                                    && roleField.getValue() === roleField.defaultValue
                                    && isBannedField.getValue() === isBannedField.defaultValue
                                    && chatIdField.getValue() === chatIdField.defaultValue)
                                    || !(usernameField.validate() && roleField.validate()
                                        && isBannedField.validate() && chatIdField.validate())) this.setDisabled(true)
                                else this.setDisabled(false)
                            },
                            handler: function (me) {
                                ExtUtil.mask('webUsersContainer', 'Обновление пользователя')
                                let params = {}
                                params.pid = ExtUtil.referenceQuery('webUsersGrid').getSelection().get('pid')
                                let usernameField = ExtUtil.referenceQuery('usernameField')
                                let roleField = ExtUtil.referenceQuery('roleField')
                                let isBannedField = ExtUtil.referenceQuery('isBannedField')
                                let chatIdField = ExtUtil.referenceQuery('chatIdField')
                                if (usernameField.getValue() !== usernameField.defaultValue) params.username = usernameField.getValue()
                                if (roleField.getValue() !== roleField.defaultValue) params.role = roleField.getValue()
                                if (isBannedField.getValue() !== isBannedField.defaultValue) params.isBanned = isBannedField.getValue()
                                if (chatIdField.getValue() !== chatIdField.defaultValue) params.chatId = chatIdField.getValue()
                                ExtUtil.mRequest({
                                    url: '/users/web/update',
                                    params: params,
                                    success: function (response) {
                                        if (params.username) usernameField.defaultValue = params.username
                                        if (params.role) roleField.defaultValue = params.role
                                        if (params.isBanned) isBannedField.defaultValue = params.isBanned
                                        if (params.chatId) chatIdField.defaultValue = params.chatId
                                        me.updateDisable()
                                        Ext.getStore('webUserStore').reload()
                                        ExtUtil.maskOff('webUsersContainer')
                                    }
                                })
                            }
                        }
                    ]
                }
            ]
        }
    ]
})