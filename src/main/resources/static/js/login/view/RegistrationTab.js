Ext.define('Login.view.RegistrationTab',  {
    extend: 'Ext.container.Container',
    xtype: 'registrationtab',
    padding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [
        {
            xtype: 'fieldset',
            width: '100%',
            padding: '10 10 0 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 120,
                xtype: 'textfield',
                labelAlign: 'left',
                msgTarget: 'qtip',
            },
            items: [
                {
                    label: 'Логин',
                    required: true,
                    requiredMessage: 'Введите логин',
                    minLength: 4,
                    validator: ValidatorUtil.validateLogin,
                },
                {
                    xtype: 'passwordfield',
                    label: 'Пароль',
                    required: true,
                    requiredMessage: 'Введите пароль',
                    inputType: 'password',
                    minLength: 8,
                    validator: ValidatorUtil.validateNotEmptyAndLettersAndNumber
                },
                {
                    xtype: 'passwordfield',
                    label: 'Повторите пароль',
                    required: true,
                    requiredMessage: 'Введите пароль ещё раз',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm,
                },
                {
                    label: 'Ваш chat id',
                    required: true,
                    requiredMessage: 'Введите chat id',
                    tooltip: 'Чтобы узнать свой chat id, введите в боте команду /chatid',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm
                },
                {
                    label: 'Токен',
                    requiredMessage: 'Введите токен',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm
                },
            ]
        },
        {
            xtype: 'button',
            text: 'Зарегистрироваться',
            handler: 'registerUser',
            margin: '10 0 0 0'
        },
    ]
})