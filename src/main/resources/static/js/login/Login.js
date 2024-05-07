Ext.application({
    extend: 'Ext.app.Application',
    name: 'Login',

    // quickTips: false,
    // platformConfig: {
    //     desktop: {
    //         quickTips: true
    //     }
    // },

    appFolder: '/js/login',

    viewport: {
        listeners: {
            painted: function (me) {
                Ext.create('Login.view.LoginDialog').show()
            }
        }
    }
})