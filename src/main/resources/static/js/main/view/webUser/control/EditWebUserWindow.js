Ext.define('Main.view.webUser.control.EditWebUserWindow', {
    extend: 'Ext.window.Window',
    reference: 'editWebUserWindow',
    width: '95%',
    draggable: false,
    autoShow: true,
    modal: true,
    title: 'Редактирование пользователя',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    padding: '10 0 20 0',
    defaults: {
        margin: '10 10 0 10'
    },
    items: [
        {
            xtype: 'textfield',
            reference: 'pidField',
            bind: {
                value: '{user.pid}',
            },
            hidden: true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Логин',
            reference: 'usernameField',
            bind: {
                value: '{user.username}'
            },
            validator: ValidatorUtil.validateChangeLogin,
            msgTarget: 'side',
            listeners: {
                afterrender: function (me) {
                    me.defaultValue = me.up('window').getViewModel().getData().user.username
                }
            }
        },
        {
            xtype: 'combobox',
            reference: 'roleField',
            fieldLabel: 'Роль',
            displayField: 'displayName',
            msgTarget: 'side',
            emptyText: 'Роль',
            valueField: 'name',
            store: 'roleStore',
            listeners: {
                afterrender: function (me) {
                    let role = me.up('window').getViewModel().getData().user.role.name
                    this.setValue(me.getStore().getRange().filter(rec => rec.getData().name === role)[0])
                }
            },
            validator: ValidatorUtil.validateNotEmpty
        },
        {
            xtype: 'numberfield',
            fieldLabel: 'Chat ID',
            reference: 'chatIdField',
            hideTrigger: true,
            bind: {
                value: '{user.chatId}'
            }
        },
        {
            xtype: 'checkboxfield',
            reference: 'isEnabledField',
            fieldLabel: 'Доступ',
            bind: {
                value: '{user.isEnabled}'
            }
        },
        {
            xtype: 'panel',
            margin: '20 0 0 0',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'middle'
            },
            defaults: {
                width: 100
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Сохранить',
                    cls: 'greenButton',
                    margin: '0 10 0 0',
                    handler: function (btn) {
                        let win = btn.up('window')
                        ExtUtil.loadingByReference('editWebUserWindow')
                        let form = ExtUtil.getJsonData(['pidField', 'usernameField', 'roleField', 'isEnabledField', 'chatIdField'])
                        ExtUtil.request({
                            url: '/web/user/update',
                            jsonData: form,
                            loadingComponent: win,
                            success: function (response) {
                                Ext.getStore('webUserStore').reload()
                                ExtUtil.turnOffLoadingByReference('editWebUserWindow')
                                win.close()
                            }
                        })
                    }
                },
                {
                    xtype: 'button',
                    cls: 'redButton',
                    text: 'Отмена',
                    handler: ExtUtil.closeWindow
                }
            ]
        }
    ]
})