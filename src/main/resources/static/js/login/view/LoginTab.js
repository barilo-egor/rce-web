Ext.define('Login.view.LoginTab',  {
    extend: 'Ext.Container',
    xtype: 'logintab',
    padding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'center',
    },

    items: [
        {
            xtype: 'fieldset',
            width: '100%',
            flex: 0.8,
            padding: '10 10 0 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 120,
                msgTarget: 'qtip',
                validator: ValidatorUtil.validateNotEmpty
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Логин',
                    name: 'username',
                    requiredMessage: 'Введите логин',
                    minLength: 4
                },
                {
                    xtype: 'passwordfield',
                    label: 'Пароль',
                    requiredMessage: 'Введите пароль',
                    revealable: true,
                    minLength: 8
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            flex: 0.2,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'end'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Войти',
                    iconCls: 'x-fa fa-sign-in-alt',
                    handler: 'registerUser',
                    margin: '10 0 0 0'
                }
            ]
        }
    ]
})