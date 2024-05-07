Ext.define('Login.view.LoginPanel', {
    xtype: 'loginpanel',
    extend: 'Ext.tab.Panel',
    requires: [
        'Login.view.RegistrationTab',
        'Login.view.LoginTab'
    ],
    region: 'center',
    scrollable: true,
    fullscreen: true,
    border: false,

    items: [
        {
            title: 'Вход',
            iconCls: 'x-fa fa-sign-in-alt',
            layout: 'fit',
            items: [
                {
                    xtype: 'logintab'
                }
            ]
        },
        {
            title: 'Регистрация',
            iconCls: 'x-fa fa-user-edit',
            layout: 'fit',
            items: [
                {
                    xtype: 'registrationtab'
                }
            ]
        }
    ]
})