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
    collapsible: ExtUtilConfig.getCollapsible('right'),

    layout: {
        type: 'vbox',
        align: 'stretch'
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
                        this.defaultValue = user.isBanned
                        this.setValue(user.isBanned)
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
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Реквизит покупки',
                    reference: 'buyRequisiteField',
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.buyRequisite
                        this.setValue(user.buyRequisite)
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Реквизит продажи',
                    reference: 'sellRequisiteField',
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.sellRequisite
                        this.setValue(user.sellRequisite)
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
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Курс RUB',
                    decimals: 0,
                    reference: 'usdCourseRUBField',
                    clearable: false,
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.usdCourseRUB
                        this.setValue(user.usdCourseRUB)
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Курс BYN',
                    decimals: 0,
                    reference: 'usdCourseBYNField',
                    clearable: false,
                    listeners: {
                        change: 'change'
                    },
                    setUserValue: function (user) {
                        this.defaultValue = user.usdCourseBYN
                        this.setValue(user.usdCourseBYN)
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
                let fieldsReferences = ExtUtil.referenceQuery('userFieldsContainer').getFieldsReferences()
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
                else this.setDisabled(false)
            },
            handler: 'updateUser'
        }
    ]
})