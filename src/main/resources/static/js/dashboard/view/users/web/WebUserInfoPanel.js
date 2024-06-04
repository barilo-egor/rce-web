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
    collapsible: ExtUtilConfig.getCollapsible('right'),

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            flex: 1,
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
            reference: 'webUserFieldsContainer',
            hidden: true,

            getFieldsReferences: function () {
                if (!this.fieldsReferences) {
                    ExtUtil.setFieldsReferences(this)
                }
                return this.fieldsReferences
            },

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
                    required: true,
                    requiredMessage: 'Username обязателен',
                    validators: function (val) {
                        if (val === this.defaultValue) return true
                        return ValidatorUtil.validateLogin(val)
                    },
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.username
                        this.setValue(user.username)
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
                    },
                    setUserValue: function (user) {
                        let role = this.getStore().getRange().filter(role => role.get('name') === user.role.name)[0]
                        this.defaultValue = role.get('name')
                        this.setValue(role)
                    },
                    validators: function (val) {
                        if (this.defaultValue === val) return true
                        let result = false
                        let combo = this
                        ExtUtil.mRequest({
                            url: '/users/web/hasAccess',
                            method: 'GET',
                            async: false,
                            params: {
                                role: combo.getValue()
                            },
                            success: function (response) {
                                result = response.body.data.hasAccess === true
                            }
                        })
                        if (result === true) return true
                        else return 'У вас нет доступа для установки этой роли'
                    }
                },
                {
                    xtype: 'togglefield',
                    label: 'В бане',
                    reference: 'isBannedField',
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = !user.isEnabled
                        this.setValue(!user.isEnabled)
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
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.chatId
                        this.setValue(user.chatId)
                    }
                }
            ]
        },
        {
            xtype: 'button',
            text: 'Обновить',
            reference: 'updateButton',
            disabled: true,
            hidden: true,
            margin: '30 20 0 20',
            updateDisable: function () {
                let fieldsReferences = ExtUtil.referenceQuery('webUserFieldsContainer').getFieldsReferences()
                let withDefaultValuesCounter = 0
                for (let reference of fieldsReferences) {
                    let field = ExtUtil.referenceQuery(reference)
                    if (!field.validate()) {
                        this.setDisabled(true)
                        return
                    }
                    if (field.defaultValue === field.getValue()) withDefaultValuesCounter++
                }
                if (withDefaultValuesCounter === fieldsReferences.length) this.setDisabled(true)
                // let usernameField = ExtUtil.referenceQuery('usernameField')
                // let roleField = ExtUtil.referenceQuery('roleField')
                // let isBannedField = ExtUtil.referenceQuery('isBannedField')
                // let chatIdField = ExtUtil.referenceQuery('chatIdField')
                // if (!(usernameField.defaultValue && roleField.defaultValue
                //     && typeof isBannedField.defaultValue !== 'undefined' && chatIdField.defaultValue)) return
                // if ((usernameField.getValue() === usernameField.defaultValue
                //         && roleField.getValue() === roleField.defaultValue
                //         && isBannedField.getValue() === isBannedField.defaultValue
                //         && chatIdField.getValue() === chatIdField.defaultValue)
                //     || !(usernameField.validate() && roleField.validate()
                //         && isBannedField.validate() && chatIdField.validate())) this.setDisabled(true)
                else this.setDisabled(false)
            },
            handler: 'updateUser'
        }
    ]
})