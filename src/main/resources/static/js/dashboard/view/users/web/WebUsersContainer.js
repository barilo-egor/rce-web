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
                childdoubletap: function () {
                    ExtUtil.referenceQuery('webUserInfoPanel').expand()
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
                    hidden: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Username'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Роль'
                        },
                        {
                            xtype: 'combobox',
                            label: 'В бане'
                        },
                        {
                            xtype: 'numberfield',
                            label: 'Chat id'
                        }
                    ]
                }
            ]
        }
    ]
})