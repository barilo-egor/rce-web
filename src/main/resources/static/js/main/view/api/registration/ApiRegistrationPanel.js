Ext.define('Main.view.api.registration.ApiRegistrationPanel', {
    xtype: 'apiregistrationpanel',
    extend: 'Main.view.components.FramePanel',
    controller: 'apiRegistrationController',
    requires: [
        'Main.view.components.button.RegisterButton',
        'Main.view.components.panel.DiscountHintPanel'
    ],
    title: {
        xtype: 'mainframetitle',
        text: 'Регистрация апи-пользователя'
    },
    scrollable: true,
    padding: '0 0 0 0',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'form',
            id: 'apiuserregisteform',
            padding: '20 20 20 20',
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 150
            },
            items: [
                {
                    xtype: 'textfield',
                    id: 'idField',
                    fieldLabel: 'Идентификатор',
                    emptyText: 'Введите идентификатор',
                    name: 'id',
                    msgTarget: 'side',
                    padding: '0 0 5 0',
                    validator: ValidatorUtil.validateIdWithExists
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Реквизит для покупки',
                    emptyText: 'Введите реквизит для покупки',
                    padding: '0 0 5 0',
                    name: 'buyRequisite',
                    msgTarget: 'side',
                    validator: ValidatorUtil.validateNotEmpty
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Реквизит для продажи',
                    emptyText: 'Введите реквизит для продажи',
                    padding: '0 0 5 0',
                    name: 'sellRequisite',
                    msgTarget: 'side',
                    validator: ValidatorUtil.validateNotEmpty
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Персональная скидка',
                    name: 'personalDiscount',
                    emptyText: 'Введите скидку от -99 до 99',
                    value: 0,
                    decimalSeparator: '.',
                    padding: '0 0 5 0',
                    hideTrigger: true,
                    msgTarget: 'side',
                    listeners: {
                        render: function (component) {
                            component.getEl().on('click', function (event, el) {
                                ExtUtil.idQuery('discountHintOuterPanel').show()
                                ExtUtil.idQuery('discountHintPanel').show()
                            });
                        },
                        focusleave: function () {
                            ExtUtil.idQuery('discountHintOuterPanel').hide()
                            ExtUtil.idQuery('discountHintPanel').hide()
                        }
                    },
                    validator: ValidatorUtil.validateDiscount
                },
                {
                    xtype: 'panel',
                    id: 'discountHintOuterPanel',
                    hidden: true,
                    layout: 'fit',
                    padding: '0 0 15 0',
                    items: [
                        {
                            xtype: 'discounthintpanel'
                        }
                    ]
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Курс USD BYN',
                    name: 'usdCourseBYN',
                    emptyText: 'Введите курс',
                    decimalSeparator: '.',
                    padding: '0 0 5 0',
                    hideTrigger: true,
                    msgTarget: 'side',
                    validator: function (val) {
                        if (this.hidden) {
                            return true
                        } else {
                            return ValidatorUtil.validatePositiveInt(val)
                        }
                    },
                    hidden: true,
                    listeners: {
                        beforerender: function (me) {
                            ExtUtil.request({
                                url: '/web/api/user/isOn',
                                params: {
                                    fiatCurrency: 'BYN'
                                },
                                method: 'GET',
                                success: function (response) {
                                    if (response.body.data.result) me.show()
                                }
                            })
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Курс USD RUB',
                    name: 'usdCourseRUB',
                    emptyText: 'Введите курс',
                    decimalSeparator: '.',
                    padding: '0 0 5 0',
                    hideTrigger: true,
                    msgTarget: 'side',
                    validator: function (val) {
                        if (this.hidden) {
                            return true
                        } else {
                            return ValidatorUtil.validatePositiveInt(val)
                        }
                    },
                    hidden: true,
                    listeners: {
                        beforerender: function (me) {
                            ExtUtil.request({
                                url: '/web/api/user/isOn',
                                params: {
                                    fiatCurrency: 'RUB'
                                },
                                method: 'GET',
                                success: function (response) {
                                    if (response.body.data.result) me.show()
                                }
                            })
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Фиатная валюта по умолчанию',
                    displayField: 'displayName',
                    emptyText: 'Выберите фиатную валюту',
                    valueField: 'name',
                    editable: false,
                    name: 'fiatCurrency',
                    store: 'fiatCurrenciesStore',
                    validator: ValidatorUtil.validateNotEmpty
                },
            ]
        },
        {
            xtype: 'panel',
            buttonAlign: 'center',
            buttons: [
                {
                    xtype: 'registerbutton',
                    handler: 'register'
                }
            ]
        }
    ]
})