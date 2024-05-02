Ext.define('Main.view.games.slotreel.SlotReelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slotReelController',

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