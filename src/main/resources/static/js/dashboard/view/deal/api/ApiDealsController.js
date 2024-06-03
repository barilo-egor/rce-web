Ext.define('Dashboard.view.deal.api.ApiDealsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiDealsController',

    init: function(grid) {
        if (Ext.os.is.Desktop) {
            grid.el.on({
                scope: this,
                contextmenu: this.onContextMenu
            });
        }
    },

    destroy: function() {
        this.toolMenu = Ext.destroy(this.toolMenu);

        this.callParent();
    },

    getMenu: function() {
        var menu = this.toolMenu,
            view = this.getView();

        if (!menu) {
            this.toolMenu = menu = Ext.create(Ext.apply({
                ownerCmp: ExtUtil.referenceQuery('apiDealsGrid')
            }, ExtUtil.referenceQuery('apiDealsGrid').toolContextMenu));
        }

        return menu;
    },

    updateMenu: function(record, el, e, align) {
        var menu = this.getMenu();

        ExtUtil.referenceQuery('apiDealsMenu').getViewModel().set('record', record.getData());
        menu.autoFocus = !e.pointerType;
        menu.showBy(el, align);
    },

    onContextMenu: function(e) {
        var grid = ExtUtil.referenceQuery('apiDealsGrid'),
            target = e.getTarget(grid.itemSelector),
            item;

        if (target) {
            e.stopEvent();

            item = Ext.getCmp(target.id);

            if (item) {
                this.updateMenu(item.getRecord(), item.el, e, 't-b?');
            }
        }
    },

    onMenu: function(grid, context) {
        this.updateMenu(context.record, context.tool.el, context.event, 'r-l?');
    },

    search: function (me) {
        let store = Ext.getStore('apiDealStore')
        store.loadPage(1)
    },

    clearFilterForm: function(me) {
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
        me.menu.setViewModel({
            data: {
                deal: eObj.record
            }
        })
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },
    selectDeal: function (me, selected) {
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

    loadStore: function(me) {
        me.getStore().load()
    }
})