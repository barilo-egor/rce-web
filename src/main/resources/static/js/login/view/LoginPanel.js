Ext.define('Login.view.LoginPanel', {
    xtype: 'loginpanel',
    extend: 'Ext.tab.Panel',
    requires: [
        'Login.view.RegistrationTab',
        'Login.view.LoginTab'
    ],
    region: 'center',
    scrollable: true,
    border: false,
    items: [
        {
            title: 'Вход',
            items: [
                {
                    xtype: 'logintab'
                }
            ]
        },
        {
            title: 'Регистрация',
            items: [
                {
                    xtype: 'registrationtab'
                }
            ]
        }
    ]
})