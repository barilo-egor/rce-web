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
            iconCls: 'fas fa-sign-in-alt',
            items: [
                {
                    xtype: 'logintab'
                }
            ]
        },
        {
            title: 'Регистрация',
            iconCls: 'fas fa-user-edit',
            items: [
                {
                    xtype: 'registrationtab'
                }
            ]
        }
    ]
})