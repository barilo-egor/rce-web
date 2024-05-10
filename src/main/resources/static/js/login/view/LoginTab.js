Ext.define('Login.view.LoginTab',  {
    extend: 'Ext.Container',
    xtype: 'logintab',
    requires: [
        'Login.controller.LoginController'
    ],
    controller: 'loginController',

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
                msgTarget: 'qtip'
            },
            items: [
                {
                    xtype: 'textfield',
                    reference: 'loginLoginField',
                    label: 'Логин',
                    name: 'username',
                    requiredMessage: 'Введите логин',
                    required: true,
                    minLength: 4,
                    listeners: {
                        keyup: 'enterKeyUp'
                    }
                },
                {
                    xtype: 'passwordfield',
                    reference: 'passwordLoginField',
                    label: 'Пароль',
                    requiredMessage: 'Введите пароль',
                    required: true,
                    revealable: true,
                    minLength: 8,
                    listeners: {
                        keyup: 'enterKeyUp'
                    }
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
                    handler: 'login',
                    margin: '10 0 0 0'
                }
            ]
        }
    ]
})