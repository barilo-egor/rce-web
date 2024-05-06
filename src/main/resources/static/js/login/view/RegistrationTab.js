Ext.define('Login.view.RegistrationTab',  {
    extend: 'Ext.container.Container',
    xtype: 'registrationtab',
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
                width: '100%',
                xtype: 'textfield',
                labelWidth: 120,
                labelAlign: 'right',
                msgTarget: 'qtip',
            },
            items: [
                {
                    fieldLabel: 'Логин',
                    emptyText: 'Введите логин',
                    minLength: 4,
                    validator: ValidatorUtil.validateLogin,
                },
                {
                    fieldLabel: 'Пароль',
                    emptyText: 'Введите пароль',
                    inputType: 'password',
                    minLength: 8,
                    validator: ValidatorUtil.validateNotEmptyAndLettersAndNumber,
                    triggers: CommonTrigger.password
                },
                {
                    fieldLabel: 'Повторите пароль',
                    emptyText: 'Введите пароль ещё раз',
                    inputType: 'password',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm,
                    triggers: CommonTrigger.password
                },
                {
                    fieldLabel: 'Ваш chat id',
                    emptyText: 'Введите chat id',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm,
                    triggers: {
                        question: {
                            cls: 'x-form-question-trigger',
                            handler: function () {
                                ExtUtil.Msg.message({
                                    text: 'Чтобы узнать свой чат айди, введите команду /chatid в боте.'
                                })
                            }
                        }
                    }
                },
                {
                    fieldLabel: 'Токен',
                    emptyText: 'Введите токен',
                    minLength: 8,
                    validator: ValidatorUtil.validatePasswordConfirm,
                    triggers: {
                        question: {
                            cls: 'x-form-question-trigger',
                            handler: function () {
                                ExtUtil.Msg.message({
                                    text: 'Для API клиентов. Запросить можно через оператора.'
                                })
                            }
                        }
                    }
                },
            ]
        },
        {
            xtype: 'button',
            text: 'Зарегистрироваться',
            handler: 'registerUser',
            width: 180
        },
    ]
})