Ext.define('Main.view.games.rps.RPSController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rpsController',

    change: function (me) {
        ExtUtil.changeDefaultValue(me)
    },

    beforerender: function (me) {
        GamesUtil.getProperties(me)
    },

    saveButtonClick: function (me) {
        GamesUtil.updateProperties(me.up('panel'))
    }
})