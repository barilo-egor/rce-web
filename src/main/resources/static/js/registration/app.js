Ext.Loader.setConfig({
    disableCaching: false,
});
Ext.application({
    name: 'Registration',
    extend: 'Ext.app.Application',
    appFolder: '/js/registration',
    title: 'Регистрация',
    autoCreateViewport: true
});