Ext.define('Dashboard.view.deal.api.ApiDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'apidealsgrid',
    reference: 'apiDealsGrid',

    requires: [
        'Dashboard.view.deal.api.ApiDealsController',
        'Dashboard.view.deal.api.ApiDealsGridMenu'
    ],
    controller: 'apiDealsController',

    flex: 1,
    shadow: true,
    margin: '5 5 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-file-excel darkGreen',
                tooltip: 'Экспорт сделок в Excel',
                handler: function (me) {
                    ExtUtil.mRequest({
                        url: '/deal/api/beforeExport',
                        jsonData: Ext.getStore('apiDealStore').getFiltersFromPanel(),
                        success: function (response) {
                            if (response.body.data.success) {
                                window.open('/deal/api/export')
                            } else {
                                ExtMessages.topToast('Ошибка при экспорте сделок.')
                            }
                        }
                    })
                }
            }
        ]
    },
    items: [
        {
            xtype: 'grid',
            reference: 'apiDealsGrid',
            store: Ext.create('Dashboard.store.deal.api.ApiDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: function (me, eObj) {
                    me.deselectAll();
                    me.setSelection(eObj.record);
                    if (!me.menu) {
                        me.menu = Ext.create('Dashboard.view.deal.api.ApiDealsGridMenu')
                    }
                    me.menu.setViewModel({
                        data: {
                            deal: eObj.record
                        }
                    })
                    me.menu.showAt(eObj.event.getX(), eObj.event.getY());
                    eObj.event.stopEvent()
                },
                select: function (me, selected) {
                    ExtUtil.mask('apiUserInfoPanel', 'Обновление данных')
                    let user = selected[0].getData().user
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
                    ExtUtil.referenceQuery('userInfoFieldsContainer').setHidden(false)
                    ExtUtil.referenceQuery('idDisplayField').setValue(user.id)
                    ExtUtil.referenceQuery('dealsCountDisplayField').setValue(user.dealsCount)
                    ExtUtil.referenceQuery('isBannedDisplayField').setValue(user.isBanned ? 'Да' : 'Нет')
                    ExtUtil.referenceQuery('personalDiscountDisplayField').setValue((user.personalDiscount ? user.personalDiscount : '0') + '%')
                    ExtUtil.referenceQuery('buyRequisiteDisplayField').setValue(user.buyRequisite ? user.buyRequisite : 'Отсутствует')
                    ExtUtil.referenceQuery('sellRequisiteDisplayField').setValue(user.sellRequisite ? user.sellRequisite : 'Отсутствует')
                    ExtUtil.referenceQuery('bynUsdCourseDisplayField').setValue(user.bynUsdCourse ? user.bynUsdCourse : 'Отсутствует')
                    ExtUtil.referenceQuery('rubUsdCourseDisplayField').setValue(user.rubUsdCourse ? user.rubUsdCourse : 'Отсутствует')
                    ExtUtil.referenceQuery('registrationDateDisplayField').setValue(user.registrationDate)
                    ExtUtil.maskOff('apiUserInfoPanel')
                },
                painted: function(me) {
                    me.getStore().load()
                }
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 80
                },
                {
                    text: 'Статус',
                    dataIndex: 'dealStatus',
                    flex: 0.5,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val) {
                        return '<span class="' + val.color + '">' + val.description + '</span>'
                    }
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    },
                    flex: 0.3
                },
                {
                    text: 'ID',
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.id
                    },
                    flex: 0.3
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    flex: 0.3
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount',
                    flex: 0.3
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'requisite',
                    flex: 1
                }
            ]
        }
    ]
})