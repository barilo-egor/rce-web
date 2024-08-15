Ext.define('Dashboard.view.users.api.ApiUserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiuserinfopanel',
    reference: 'apiUserInfoPanel',
    requires: [
        'Dashboard.view.users.api.ApiUsersController'
    ],
    controller: 'apiUsersController',

    margin: '10 10 10 5',
    collapsed: true,
    title: 'Пользователь',
    shadow: true,
    width: 400,
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
            alignSelf: 'stretch',
            reference: 'userFieldsContainer',
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
                // width: 200,
                margin: '0 20 0 20'
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'ID',
                    reference: 'idField',
                    required: true,
                    clearable: false,
                    validators: function (val) {
                        if (val === this.defaultValue) return true
                        return ValidatorUtil.validateIdWithExists(val)
                    },
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.id
                        this.setValue(user.id)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'personalDiscountField',
                    label: 'Персональная скидка',
                    required: true,
                    listeners: {
                        change: 'change'
                    },
                    validators: function (val) {
                        if (val === this.defaultValue) return true
                        return ValidatorUtil.numberValidateNotEmpty(val)
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.personalDiscount
                        this.setValue(user.personalDiscount)
                        this.fireEvent('change')
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
                        this.defaultValue = user.isBanned === true
                        this.setValue(user.isBanned)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Токен',
                    reference: 'tokenField',
                    listeners: {
                        change: 'change'
                    },
                    clearable: false,
                    editable: false,
                    triggers: {
                        generateNew: {
                            iconCls: 'x-fa fa-sync-alt',
                            tooltip: 'Сгенерировать новый',
                            handler: 'generateToken'
                        }
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.token
                        this.setValue(user.token)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'combobox',
                    label: 'Фиат по умолчанию',
                    reference: 'fiatCurrencyField',
                    displayField: 'code',
                    valueField: 'name',
                    editable: false,
                    store: {
                        type: 'fiatCurrenciesStore'
                    },
                    queryMode: 'local',
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        let fiatCurrency = this.getStore().getRange().filter(role => role.get('name') === user.fiatCurrency.name)[0]
                        this.defaultValue = fiatCurrency.get('name')
                        this.setValue(fiatCurrency)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Курс RUB',
                    decimals: 2,
                    reference: 'usdCourseRUBField',
                    clearable: false,
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.usdCourseRUB
                        this.setValue(user.usdCourseRUB)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Курс BYN',
                    decimals: 3,
                    reference: 'usdCourseBYNField',
                    clearable: false,
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = typeof user.usdCourseBYN === 'undefined' ? null : user.usdCourseBYN
                        this.setValue(user.usdCourseBYN)
                        this.fireEvent('change')
                    }
                },
                {
                    xtype: 'container',
                    reference: 'groupChatPidField',
                    layout: 'fit',
                    getValue: function () {
                        return this.getItems().items[0].groupPid
                    },
                    setUserValue: function (user) {
                        let field = this.getItems().items[0]
                        field.groupPid = user.groupChat.pid
                        this.defaultValue = user.groupChat.pid
                        field.setValue(user.groupChat.title)
                        field.fireEvent('change')
                    },
                    validate: function () {
                        return this.getItems().items[0].validate()
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            reference: 'apiDealRequestGroupField',
                            label: 'Группа запросов',
                            labelAlign: 'left',
                            labelWidth: 110,
                            width: 230,
                            clearable: false,
                            editable: false,
                            tooltip: 'Группа, в которую отправляются запросы на вывод API сделок.',
                            listeners: {
                                change: 'change'
                            },
                            triggers: {
                                clearValue: {
                                    iconCls: 'x-fa fa-times',
                                    handler: function (me) {
                                        let field = ExtUtil.referenceQuery('apiDealRequestGroupField')
                                        field.groupPid = null
                                        field.setValue('Отсутствует')
                                    }
                                },
                                change: {
                                    iconCls: 'x-fa fa-wrench material-blue-color',
                                    handler: function (me) {
                                        Ext.create('Dashboard.view.users.api.dialog.DealRequestGroupDialog').show()
                                    }
                                }
                            }
                        }
                    ]
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
                let fieldsReferences = ExtUtil.referenceQuery('userFieldsContainer').getFieldsReferences()
                let withDefaultValuesCounter = 0
                for (let reference of fieldsReferences) {
                    let field = ExtUtil.referenceQuery(reference)
                    if (!field.validate()) {
                        this.setDisabled(true)
                        return
                    }
                    let value = field.getValue()
                    let defaultValue = field.defaultValue
                    let isBothNull = (value === null || typeof value === 'undefined')
                        && (defaultValue === null || typeof defaultValue === 'undefined')
                    if (defaultValue === value || isBothNull) withDefaultValuesCounter++
                    else {
                        debugger
                    }
                }
                if (withDefaultValuesCounter === fieldsReferences.length) this.setDisabled(true)
                else this.setDisabled(false)
            },
            handler: 'updateUser'
        }
    ]
})