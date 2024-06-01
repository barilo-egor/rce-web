Ext.define('Dashboard.view.users.web.WebUserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'webuserinfopanel',
    reference: 'webUserInfoPanel',
    requires: [
        'Dashboard.view.users.web.WebUsersController'
    ],
    controller: 'webUsersController',

    margin: '10 10 10 5',
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
                        change: 'change'
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
                        change: 'change'
                    }
                },
                {
                    xtype: 'togglefield',
                    label: 'В бане',
                    reference: 'isBannedField',
                    listeners: {
                        change: 'change'
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Chat id',
                    decimals: 0,
                    reference: 'chatIdField',
                    clearable: false,
                    validators: function (val) {
                        if (val === this.defaultValue) return true
                        return ValidatorUtil.validateChatId(val)
                    },
                    listeners: {
                        change: 'change'
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
                    handler: 'updateUser'
                }
            ]
        }
    ]
})