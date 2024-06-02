Ext.define('Dashboard.view.users.api.ApiUsersGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'apiusersgrid',
    requires: [
        'Dashboard.view.users.api.ApiUsersController',
        'Dashboard.view.users.api.ApiUsersGridMenu'
    ],
    controller: 'apiUsersController',

    reference: 'apiUsersGrid',
    scrollable: true,
    shadow: true,
    margin: '10 5 10 10',
    store: Ext.create('Dashboard.store.users.api.ApiUserStore'),

    listeners: {
        select: 'select',
        deselect: 'deselect',
        painted: 'reloadStore',
        childcontextmenu: function (me, eObj) {
            me.deselectAll();
            me.setSelection(eObj.record);
            if (!me.menu) {
                me.menu = Ext.create('Dashboard.view.users.api.ApiUsersGridMenu')
            }
            me.menu.showAt(eObj.event.getX(), eObj.event.getY());
            eObj.event.stopEvent()
        },
    },

    columns: [
        {
            text: 'ID',
            dataIndex: 'id',
            flex: 0.5
        },
        {
            text: 'Скидка',
            dataIndex: 'personalDiscount',
            width: 70
        },
        {
            text: 'Дата регистрации',
            dataIndex: 'registrationDate',
            width: 140
        },
        {
            text: 'В бане',
            dataIndex: 'isBanned',
            editable: true,
            renderer: function (val) {
                return val ? 'Да' : 'Нет'
            },
            width: 80
        },
        {
            text: 'Токен',
            dataIndex: 'token',
            flex: 1
        },
        {
            text: 'Реквизит покупки',
            dataIndex: 'buyRequisite',
            flex: 1
        },
        {
            text: 'Реквизит продажи',
            dataIndex: 'sellRequisite',
            flex: 1
        },
        {
            text: 'Фиат',
            dataIndex: 'fiatCurrency',
            renderer: function (val) {
                return val ? val.code : 'Отсутствует'
            },
            width: 60
        },
        {
            text: 'Курс RUB',
            dataIndex: 'usdCourseRUB',
            width: 85
        },
        {
            text: 'Курс BYN',
            dataIndex: 'usdCourseBYN',
            width: 85
        }
    ]
})