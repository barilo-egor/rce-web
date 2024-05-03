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
            padding: '10 10 10 10',
            width: '100%',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    labelWidth: 120,
                    labelAlign: 'right',
                    msgTarget: 'qtip',
                    fieldLabel: 'Логин',
                    name: 'username',
                    emptyText: 'Введите логин',
                    minLength: 4,
                    validator: ValidatorUtil.validateLogin,
                    width: '100%',
                },
                {
                    xtype: 'textfield',
                    labelWidth: 120,
                    labelAlign: 'right',
                    msgTarget: 'qtip',
                    fieldLabel: 'Пароль',
                    name: 'password',
                    emptyText: 'Введите пароль',
                    inputType: 'password',
                    minLength: 8,
                    validator: ValidatorUtil.validateNotEmptyAndLettersAndNumber,
                    width: '100%',
                }
            ]
        },
        {
            xtype: 'button',
            text: 'Войти',
            handler: 'registerUser',
            width: 180
        },
    ]
})