Ext.define('Main.view.paymentTypes.requisites.RequisiteForm', {
    extend: 'Ext.form.Panel',
    xtype: 'requisiteform',
    id: 'requisiteForm',
    padding: '20 20 20 20',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Наименование',
            emptyText: 'Краткое наименование',
            name: 'name',
            bind: {
                value: '{requisite.name}'
            },
            validator: ValidatorUtil.validateNotEmpty
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Резквизит',
            emptyText: 'То, что будет отображаться пользователю',
            height: 200,
            name: 'requisite',
            bind: {
                value: '{requisite.requisite}'
            },
            validator: ValidatorUtil.validateNotEmpty
        }
    ]
})