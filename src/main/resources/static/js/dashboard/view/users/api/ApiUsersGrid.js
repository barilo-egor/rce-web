Ext.define('Dashboard.view.users.api.ApiUsersGrid', {
    extend: 'Ext.Panel',
    xtype: 'apiusersgrid',
    requires: [
        'Dashboard.view.users.api.ApiUsersController',
        'Dashboard.view.users.api.ApiUsersGridMenu'
    ],
    controller: 'apiUsersController',

    shadow: true,
    margin: '10 5 10 10',

    tbar: [
        {
            iconCls: 'x-fa fa-plus forestgreenColor',
            tooltip: 'Создать клиента',
            handler: 'createUser'
        }
    ],
    layout: 'fit',

    items: [
        {
            xtype: 'grid',
            reference: 'apiUsersGrid',
            store: Ext.create('Dashboard.store.users.api.ApiUserStore'),

            listeners: {
                select: 'select',
                deselect: 'deselect',
                painted: 'reloadStore',
                childcontextmenu: 'gridMenu',
            },
            scrollable: true,
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
                    xtype: 'datecolumn',
                    text: 'Дата регистрации',
                    dataIndex: 'registrationDate',
                    width: 140,
                    format: 'd.m.Y'
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
                    sorter: {
                        sorterFn: function (val1, val2) {
                            return val1.get('fiatCurrency').code.compareTo(val2.get('fiatCurrency').code)
                        }
                    },
                    width: 60
                },
                {
                    text: 'Курс RUB',
                    dataIndex: 'usdCourseRUB',
                    width: 85,
                    sorter: {
                        sorterFn: function (val1, val2) {
                            let course1 = val1.get('usdCourseRUB')
                            let course2 = val2.get('usdCourseRUB')
                            if (typeof course1 === 'undefined') return -1
                            if (typeof course2 === 'undefined') return 1
                            return course1 - course2
                        }
                    },
                },
                {
                    text: 'Курс BYN',
                    dataIndex: 'usdCourseBYN',
                    width: 85,
                    sorter: {
                        sorterFn: function (val1, val2) {
                            let course1 = val1.get('usdCourseBYN')
                            let course2 = val2.get('usdCourseBYN')
                            if (typeof course1 === 'undefined') return -1
                            if (typeof course2 === 'undefined') return 1
                            return course1 - course2
                        }
                    },
                }
            ]
        }
    ]
})