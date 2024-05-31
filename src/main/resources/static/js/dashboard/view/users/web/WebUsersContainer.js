Ext.define('Dashboard.view.users.web.WebUsersContainer', {
    extend: 'Ext.Container',
    xtype: 'webuserscontainer',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // me.up().up().setMasked('Загрузка')
    // Ext.defer(function() {
    //     let webUserPid = ExtUtil.referenceQuery('webUsersGrid').getSelection().get('pid')
    //     let roleName = Ext.getStore('webUserStore').getRange()
    //         .filter(user => user.get('pid') === webUserPid)[0].get('role').name
    //     me.setValue(me.getStore().getRange().filter(role => role.get('name') === roleName)[0]);  // Устанавливаем значение по умолчанию (Alaska)
    //     me.up().up().setMasked(false)
    // }, 1000);

    items: [
        {
            flex: 1,
            xtype: 'grid',
            reference: 'webUsersGrid',
            scrollable: true,
            shadow: true,
            margin: '10 10 10 5',
            store: Ext.create('Dashboard.store.users.web.WebUserStore'),

            listeners: {
                select: function (me, selected) {
                    me.setMasked('Загрузка')
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
                    ExtUtil.referenceQuery('userFieldsContainer').setHidden(false)
                    let user = selected[0].getData()
                    ExtUtil.referenceQuery('usernameField').setValue(user.username)
                    let roleField = ExtUtil.referenceQuery('roleField')
                    roleField.setValue(roleField.getStore().getRange().filter(role => role.get('name') === user.role)[0])
                    let isBannedField = ExtUtil.referenceQuery('isBannedField')
                    isBannedField.setValue(isBannedField.getStore().getRange().filter(isBanned => isBanned.value !== user.isEnabled)[0])
                    let chatId = ExtUtil.referenceQuery('chatId')
                    me.setMasked(false)
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
                            html: 'Выберите сделку'
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
                            reference: 'usernameField'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Роль',
                            reference: 'roleField',
                            store: {
                                type: 'roleStore'
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'В бане',
                            reference: 'isBannedField',
                            store: {
                                data: [
                                    {
                                        text: 'Да',
                                        value: true
                                    },
                                    {
                                        text: 'Нет',
                                        value: false
                                    }
                                ]
                            }
                        },
                        {
                            xtype: 'numberfield',
                            label: 'Chat id',
                            reference: 'chatIdField'
                        }
                    ]
                }
            ]
        }
    ]
})