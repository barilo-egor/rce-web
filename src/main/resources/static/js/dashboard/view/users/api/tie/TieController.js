Ext.define('Dashboard.view.users.api.tie.TieController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tieController',

    changeCurrentUser: function (me, newValue) {
        ExtUtil.referenceQuery('tieButton').setDisabled(newValue === me.defaultValue)
    },

    setValues: function (me) {
        let username = ExtUtil.referenceQuery('tieDialog').getViewModel().getData().username
        me.defaultValue = username
        me.setValue(username)
    },

    changeFilterField: function (me, newValue) {
        let store = Ext.getStore('userLoginStore')
        store.removeFilter(me.filterId)
        store.addFilter(new Ext.util.Filter({
            id: me.filterId,
            filterFn: function (item) {
                return item.get('username').startsWith(newValue)
            }
        }))
    },

    doubleClick: function (me, location) {
        let username = me.getStore().getAt(location.recordIndex).get('username')
        ExtUtil.referenceQuery('currentUserField').setValue(username)
    },

    tie: function (me) {
        let username = ExtUtil.referenceQuery('currentUserField').getValue()
        let text = !username || username.length === 0
            ? 'У пользователя будет снята роль API клиента. Продолжить?'
            : 'Пользователю так же будет установлена роль API клиента,<br>если она ещё не установлена. Продолжить?'
        ExtMessages.confirm('Привязка', text,
            function () {
                ExtUtil.mask('tieDialog')
                ExtUtil.mRequest({
                    url: '/users/api/tie',
                    loadingComponentRef: 'tieDialog',
                    params: {
                        apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid'),
                        username: username
                    },
                    success: function (response) {
                        Ext.getStore('apiUserStore').reload()
                        ExtUtil.maskOff('tieDialog')
                        ExtUtil.referenceQuery('tieDialog').close()
                    }
                })
            })
    }
})