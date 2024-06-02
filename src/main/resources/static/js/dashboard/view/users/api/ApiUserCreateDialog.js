Ext.define('Dashboard.view.users.api.ApiUserCreateDialog', {
    extend: 'Ext.Dialog',
    reference: 'createDialog',

    closable: true,
    title: 'Создание API клиента',

    buttons: [
        {
            text: 'Сохранить',
            handler: function (me) {
                ExtUtil.mask('createDialog', 'Создание клиента')
                let fieldReference = [
                    'idCreateField', 'personalDiscountCreateField', 'buyRequisiteCreateField',
                    'sellRequisiteCreateField', 'usdCourseBYNCreateField', 'usdCourseRUBCreateField',
                    'fiatCurrencyCreateField'
                ]
                let isValid = true
                fieldReference.forEach(reference => {
                    if (!ExtUtil.referenceQuery(reference).validate()) isValid = false
                })
                if (!isValid) {
                    ExtUtil.maskOff('createDialog')
                    return
                }
                ExtUtil.mRequest({
                    url: '/users/api/save',
                    jsonData: ExtUtil.getJsonDataNullable(fieldReference, 'CreateField'),
                    success: function (response) {
                        Ext.getStore('apiUserStore').reload()
                        ExtUtil.maskOff('createDialog')
                        ExtUtil.referenceQuery('createDialog').close()
                    }
                })
            }
        }
    ],
    buttonAlign: 'center',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 20 0 20',
            width: 250
        }
    },
    items: [
        {
            items: [
                {
                    xtype: 'textfield',
                    label: 'ID',
                    reference: 'idCreateField',
                    required: true,
                    validators: ValidatorUtil.validateIdWithExists
                },
                {
                    xtype: 'numberfield',
                    reference: 'personalDiscountCreateField',
                    label: 'Персональная скидка',
                    requiredMessage: 'Введите 0, если скидка не нужна.',
                    required: true
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'textfield',
                    reference: 'buyRequisiteCreateField',
                    label: 'Реквизит покупки'
                },
                {
                    xtype: 'textfield',
                    reference: 'sellRequisiteCreateField',
                    label: 'Реквизит продажи'
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'numberfield',
                    reference: 'usdCourseBYNCreateField',
                    label: 'Курс BYN'
                },
                {
                    xtype: 'textfield',
                    reference: 'usdCourseRUBCreateField',
                    label: 'Курс RUB',
                },
            ]
        },
        {
            xtype: 'combobox',
            label: 'Фиат по умолчанию',
            margin: '0 20 0 20',
            editable: false,
            valueField: 'name',
            displayField: 'code',
            queryMode: 'local',
            required: true,
            requiredMessage: 'Выберите фиатную валюту по умолчанию.',
            reference: 'fiatCurrencyCreateField',
            store: {
                type: 'fiatCurrenciesStore'
            }
        }
    ]

})