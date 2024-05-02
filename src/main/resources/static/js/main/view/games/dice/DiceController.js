Ext.define('Main.view.games.dice.DiceController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.diceController',

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