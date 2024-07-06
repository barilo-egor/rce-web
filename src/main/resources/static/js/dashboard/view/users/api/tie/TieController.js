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

    changeExistFilterField: function (me, newValue) {
        this.changeFilterField(me, newValue, Ext.getStore('apiWebUsersLoginStore'))
    },

    changeAddFilterField: function (me, newValue) {
        this.changeFilterField(me, newValue, Ext.getStore('userLoginStore'))
    },

    changeFilterField: function (me, newValue, store) {
        store.removeFilter(me.filterId)
        store.addFilter(new Ext.util.Filter({
            id: me.filterId,
            filterFn: function (item) {
                return item.get('username').startsWith(newValue)
            }
        }))
    },

    doubleClickAdd: function (me, location) {
        let username = me.getStore().getAt(location.recordIndex).get('username')
        ExtUtil.mRequest({
            url: '/users/api/addWebUser',
            params: {
                apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid'),
                username: username
            },
            success: function (response) {
                Ext.getStore('userLoginStore').reload()
                Ext.getStore('apiWebUsersLoginStore').reload()
            }
        })
    },

    doubleClickRemove: function (me, location) {
        let username = me.getStore().getAt(location.recordIndex).get('username')
        ExtUtil.mRequest({
            url: '/users/api/removeWebUser',
            params: {
                apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid'),
                username: username
            },
            success: function (response) {
                Ext.getStore('apiWebUsersLoginStore').reload()
                Ext.getStore('userLoginStore').reload()
            }
        })
    }
})