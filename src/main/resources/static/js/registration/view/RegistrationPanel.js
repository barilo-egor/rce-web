Ext.define('Registration.view.RegistrationPanel', {
    xtype: 'registrationpanel',
    extend: 'Ext.form.Panel',
    requires: [
        'Registration.view.RegistrationController'
    ],
    controller: 'registrationController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'form',
            id: 'registrationForm',
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
                            id: 'passwordInput',
                            fieldLabel: 'Пароль',
                            name: 'password',
                            emptyText: 'Введите пароль',
                            inputType: 'password',
                            minLength: 8,
                            validator: ValidatorUtil.validateNotEmptyAndLettersAndNumber,
                            width: '100%',
                        },
                        {
                            xtype: 'textfield',
                            labelWidth: 120,
                            labelAlign: 'right',
                            msgTarget: 'qtip',
                            fieldLabel: 'Повторите пароль',
                            emptyText: 'Введите пароль ещё раз',
                            inputType: 'password',
                            minLength: 8,
                            validator: ValidatorUtil.validatePasswordConfirm,
                            width: '100%'
                        },
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    labelWidth: 120,
                                    labelAlign: 'right',
                                    msgTarget: 'qtip',
                                    fieldLabel: 'Ваш chat id',
                                    emptyText: 'Введите chat id',
                                    inputType: 'password',
                                    minLength: 8,
                                    validator: ValidatorUtil.validatePasswordConfirm,
                                    flex: 0.85
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'fas fa-question',
                                    flex: 0.15
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Зарегистрироваться',
                    handler: 'registerUser',
                    width: 180
                }
            ]
        },
    ]
})