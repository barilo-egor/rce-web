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
                    triggers: CommonTrigger.password
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
                    width: '100%',
                    triggers: CommonTrigger.password
                },
                {
                    xtype: 'container',
                    margin: '0 0 10 0',
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
                            flex: 0.9
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fas fa-question',
                            margin: '0 0 0 5',
                            flex: 0.1,
                            listeners : {
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        anchor: 'left',
                                        html: 'Чтобы узнать свой чат айди, введите команду /chatid в боте.',
                                        autoHide: true
                                    });
                                }
                            }
                        },
                    ]
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
                            fieldLabel: 'Токен',
                            emptyText: 'Введите токен',
                            inputType: 'password',
                            minLength: 8,
                            validator: ValidatorUtil.validatePasswordConfirm,
                            flex: 0.9
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fas fa-question',
                            margin: '0 0 0 5',
                            flex: 0.1,
                            listeners : {
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        anchor: 'left',
                                        html: 'Для API клиентов.',
                                        autoHide: true
                                    });
                                }
                            }
                        },
                    ]
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