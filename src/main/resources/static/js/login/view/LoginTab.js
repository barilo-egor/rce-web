Ext.define('Login.view.LoginTab',  {
    extend: 'Ext.Container',
    xtype: 'logintab',
    requires: [
        'Login.controller.LoginController'
    ],
    controller: 'loginController',

    margin: '10 10 10 10',
    layout: 'fit',

    items: [
        {
            xtype: 'container',
            margin: '0 0 30 0',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'fieldset',
                    width: '100%',
                    // flex: 0.8,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    defaults: {
                        labelWidth: 120,
                        msgTarget: 'qtip'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            reference: 'loginField',
                            label: 'Chat id либо логин',
                            requiredMessage: 'Введите chat id либо логин',
                            required: true,
                            minLength: 4,
                            listeners: {
                                keyup: 'enterKeyUp'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: '100%',
                    // flex: 0.2,
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
        }
    ]
})