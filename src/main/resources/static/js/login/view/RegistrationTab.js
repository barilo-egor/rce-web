Ext.define('Login.view.RegistrationTab',  {
    extend: 'Ext.container.Container',
    requires: [
        'Login.controller.LoginController'
    ],
    controller: 'loginController',
    xtype: 'registrationtab',

    padding: '10 10 10 10',

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'fieldset',
            flex: 0.8,
            width: '100%',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 80,
                xtype: 'textfield',
                labelAlign: 'left',
                errorTarget: 'side',
            },
            items: [
                {
                    label: 'Логин',
                    reference: 'registerLoginField',
                    required: true,
                    requiredMessage: 'Введите логин',
                    minLength: 4,
                    validators: ValidatorUtil.validateLogin
                },
                {
                    xtype: 'container',
                    html: '<div style="text-align: right;">Придумайте логин для авторизации на сайте.</div>'
                },
                {
                    label: 'Ваш chat id',
                    reference: 'registerChatIdField',
                    required: true,
                    requiredMessage: 'Введите chat id',
                    minLength: 8,
                    validators: ValidatorUtil.validateChatId
                },
                {
                    xtype: 'container',
                    html: '<div style="text-align: right;">Введите в боте команду /chatid</div>'
                },
                {
                    label: 'Токен',
                    requiredMessage: 'Введите токен',
                    reference: 'registerTokenField',
                    minLength: 8
                },
                {
                    xtype: 'container',
                    html: '<div style="text-align: right;">Для апи-клиентов. Выдается оператором.</div>'
                },
            ]
        },
        {
            flex: 0.2,
            xtype: 'button',
            text: 'Зарегистрироваться',
            iconCls: 'x-fa fa-user-plus',
            handler: 'register',
            margin: '10 0 0 0',
            width: 220
        },
    ]
})