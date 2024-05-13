Ext.application({
    extend: 'Ext.app.Application',
    name: 'Login',
    requires: [
        'Login.view.LoginDialog'
    ],

    appFolder: '/js/login',

    viewport: {
        listeners: {
            painted: function (me) {
                Ext.create('Login.view.LoginDialog').show()
            }
        }
    }
})