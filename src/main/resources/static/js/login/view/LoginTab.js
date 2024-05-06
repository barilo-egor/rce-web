Ext.define('Login.view.LoginTab',  {
    extend: 'Ext.container.Container',
    xtype: 'logintab',
    padding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'fieldset',
            padding: '10 10 0 10',
            width: '100%',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            defaults: {
                xtype: 'textfield',
                labelWidth: 120,
                labelAlign: 'right',
                msgTarget: 'qtip',
                width: '100%',
                validator: ValidatorUtil.validateNotEmpty
            },
            items: [
                {

                    fieldLabel: 'Логин',
                    name: 'username',
                    emptyText: 'Введите логин',
                    minLength: 4
                },
                {
                    fieldLabel: 'Пароль',
                    emptyText: 'Введите пароль',
                    inputType: 'password',
                    minLength: 8,
                    triggers: CommonTrigger.password
                }
            ]
        },
        {
            xtype: 'button',
            text: 'Войти',
            iconCls: 'fas fa-sign-in-alt',
            handler: 'registerUser',
            width: 100
        }
    ]
})