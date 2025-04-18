Ext.define('Dashboard.view.deal.api.ApiDealsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiDealsController',

    init: function (grid) {
        if (Ext.os.is.Desktop) grid.el.on({
            scope: this,
            contextmenu: this.onContextMenu
        });
    },

    destroy: function () {
        this.toolMenu = Ext.destroy(this.toolMenu);
        this.callParent();
    },

    getMenu: function () {
        let menu = this.toolMenu
        if (!menu) {
            this.toolMenu = menu = Ext.create(Ext.apply({
                ownerCmp: ExtUtil.referenceQuery('apiDealsGrid')
            }, ExtUtil.referenceQuery('apiDealsGrid').toolContextMenu));
        }
        return menu;
    },

    updateMenu: function (record, el, e, align) {
        let menu = this.getMenu();

        ExtUtil.referenceQuery('apiDealsMenu').getViewModel().set('record', record.getData());
        menu.autoFocus = !e.pointerType;
        menu.showBy(el, align);
    },

    onContextMenu: function (e) {
        let grid = ExtUtil.referenceQuery('apiDealsGrid'),
            target = e.getTarget(grid.itemSelector),
            item;

        if (target) {
            e.stopEvent();
            item = Ext.getCmp(target.id);
            if (item) this.updateMenu(item.getRecord(), item.el, e, 't-b?');
        }
    },

    onMenu: function (grid, context) {
        this.updateMenu(context.record, context.tool.el, context.event, 'r-l?');
    },

    search: function (me) {
        let store = Ext.getStore('apiDealStore')
        store.loadPage(1)
    },

    clearFilterForm: function (me) {
        Ext.getStore('apiDealStore').fieldsReferences.forEach(field => ExtUtil.referenceQuery(field).clearValue())
    },

    dealsExport: function (me) {
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
    },

    gridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.deal.api.ApiDealsGridMenu')
        }
        let deal = eObj.record.getData()
        let menu = me.menu
        let status = deal.apiDealStatus.name
        menu.lookupReference('acceptDealMenuButton')
            .setHidden(!(status === 'PAID'))
        menu.lookupReference('declineDealMenuButton')
            .setHidden(!(status === 'PAID'))
        menu.lookupReference('acceptDealWithRequestMenuButton')
            .setHidden(status !== 'PAID' || !deal.groupChatPid)
        menu.lookupReference('showCheckMenuButton')
            .setHidden(deal.apiDealType !== 'DISPUTE')
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    selectDeal: function (me, selected) {
        ExtUtil.mask('apiDealsUserInfoPanel', 'Обновление данных')
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
        let apiUserInfoFieldsContainer = ExtUtil.referenceQuery('apiUserInfoFieldsContainer')
        apiUserInfoFieldsContainer.getFieldsReferences()
            .forEach(reference => ExtUtil.referenceQuery(reference).setUserValue(selected[0].getData().apiUser))
        apiUserInfoFieldsContainer.setHidden(false)
        ExtUtil.maskOff('apiDealsUserInfoPanel')
    },

    loadStore: function (me) {
        me.getStore().load()
    },

    copyRequisite: function (me) {
        navigator.clipboard.writeText(ExtUtil.referenceQuery('apiDealsGrid').getSelection().get('requisite'))
        ExtMessages.topToast('Реквизит скопирован в буфер обмена')
    },

    confirmDeal: function (me) {
        let deal = ExtUtil.referenceQuery('apiDealsGrid').getSelection().getData()
        let confirmFn = function () {
            ExtUtil.mRequest({
                url: '/deal/api/accept',
                params: {
                    pid: deal.pid
                },
                success: function (response) {
                    Ext.getStore('apiDealStore').reload()
                }
            })
        }
        ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + '?',
            confirmFn)
    },

    confirmDealWithRequest: function (me) {
        let deal = ExtUtil.referenceQuery('apiDealsGrid').getSelection().getData()
        let confirmFn = function () {
            ExtUtil.mRequest({
                url: '/deal/api/accept',
                params: {
                    pid: deal.pid,
                    isNeedRequest: true
                },
                success: function (response) {
                    Ext.getStore('apiDealStore').reload()
                }
            })
        }
        ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + '?',
            confirmFn)
    },

    declineDeal: function (me) {
        let deal = ExtUtil.referenceQuery('apiDealsGrid').getSelection().getData()
        let confirmFn = function () {
            ExtUtil.mRequest({
                url: '/deal/api/decline',
                params: {
                    pid: deal.pid
                },
                success: function (response) {
                    Ext.getStore('apiDealStore').reload()
                }
            })
        }
        ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите отклонить сделку №' + deal.pid + '?',
            confirmFn)
    },

    reloadDeals: function (me) {
        Ext.getStore('apiDealStore').reload()
    },

    showCheck: function (me) {
        let deal = ExtUtil.referenceQuery('apiDealsGrid').getSelection().getData()
        let checkImageId = deal.checkImageId
        let receiptFormat = deal.receiptFormat
        if (receiptFormat === 'PICTURE') {
            Ext.create('Ext.Dialog', {
                title: 'Чек по диспуту ' + deal.pid,
                closable: true,
                layout: 'fit',
                maxHeight: '90%',
                maxWidth: '90%',
                scrollable: 'y',
                masked: 'Загрузка чека',
                items: [
                    {
                        xtype: 'image',
                        src: '/image/get?imageId=' + checkImageId,
                        width: '100%',
                        height: '100%',
                        shadow: true,
                        mode: 'image',
                        margin: '5 5 5 5',
                        listeners: {
                            load: function (me) {
                                me.up('dialog').center()
                                me.up('dialog').setMasked(false)
                            }
                        }
                    }
                ]
            }).show()
        } else {
            Ext.create('Ext.Dialog', {
                title: 'Чек по диспуту ' + deal.pid,
                closable: true,
                layout: 'fit',
                height: '90%',
                width: '90%',
                scrollable: 'y',
                masked: 'Загрузка чека',
                items: [
                    {
                        xtype: 'panel',
                        shadow: true,
                        scrollable: true,
                        html: '<iframe src="/image/getPDF?fileId=' + checkImageId
                            + '" frameborder="0" style="display: block;overflow:visible;height:100vh;width:100vw"></iframe>',
                        listeners: {
                            painted: function (me) {
                                me.up('dialog').center()
                                me.up('dialog').setMasked(false)
                            }
                        }
                    }
                ]
            }).show()
        }
    }
})