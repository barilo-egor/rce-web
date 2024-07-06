Ext.define('Dashboard.view.deal.bot.BotDealsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.botDealsController',

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
                ownerCmp: ExtUtil.referenceQuery('botDealsGrid')
            }, ExtUtil.referenceQuery('botDealsGrid').toolContextMenu));
        }

        return menu;
    },

    updateMenu: function(record, el, e, align) {
        var menu = this.getMenu();

        ExtUtil.referenceQuery('botDealsMenu').getViewModel().set('record', record.getData());
        menu.autoFocus = !e.pointerType;
        menu.showBy(el, align);
    },

    onContextMenu: function(e) {
        var grid = ExtUtil.referenceQuery('botDealsGrid'),
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
        Ext.getStore('botDealStore').loadPage(1)
    },

    clearFilterForm: function(me) {
        Ext.getStore('botDealStore').fieldsReferences.forEach(field => ExtUtil.referenceQuery(field).clearValue())
    },

    manualAddDeal: function (me) {
        Ext.create('Dashboard.view.deal.bot.add.AddDialog').show()
    },

    exportDeals: function (me) {
        ExtUtil.mRequest({
            url: '/deal/bot/beforeExport',
            jsonData: Ext.getStore('botDealStore').getFiltersFromPanel(),
            success: function (response) {
                if (response.body.data.success) {
                    window.open('/deal/bot/export')
                } else {
                    ExtMessages.topToast('Ошибка при экспорте сделок.')
                }
            }
        })
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.deal.bot.BotDealsGridMenu')
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
        ExtUtil.mask('botUserInfoPanel', 'Обновление данных')
        let user = selected[0].getData().user
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
        ExtUtil.referenceQuery('userInfoFieldsContainer').setHidden(false)
        ExtUtil.referenceQuery('chatIdDisplayField').setValue(user.chatId)
        ExtUtil.referenceQuery('usernameDisplayField').setValue(user.username ? user.username : 'Скрыт')
        ExtUtil.referenceQuery('banDisplayField').setValue(user.banned ? 'Да' : 'Нет')
        ExtUtil.referenceQuery('fromChatIdDisplayField').setValue(user.fromChatId ? user.FromChatId : 'Отсутствует')
        ExtUtil.referenceQuery('referralBalanceDisplayField').setValue((user.referralBanalnce ? user.referralBanalnce : '0') + 'р.')
        ExtUtil.referenceQuery('referralPercentDisplayField').setValue(user.referralPercent + "%")
        ExtUtil.referenceQuery('isRankDiscountOnDisplayField').setValue(user.rankDiscountOn ? "Включена" : "Выключена")
        ExtUtil.referenceQuery('personalBuyDisplayField').setValue((user.personalBuy ? user.personalBuy : "0") + "%")
        ExtUtil.referenceQuery('personalSellDisplayField').setValue((user.personalSell ? user.personalSell : "0") + "%")
        ExtUtil.referenceQuery('referralUsersCountDisplayField').setValue(user.referralUsersCount + " рефералов")
        ExtUtil.referenceQuery('isActiveDisplayField').setValue(user.active === false ? 'Нет' : 'Да')
        ExtUtil.referenceQuery('dealsCountDisplayField').setValue(user.dealsCount + " сделок")
        ExtUtil.referenceQuery('registrationDateDisplayField').setValue(user.registrationDate)
        ExtUtil.maskOff('botUserInfoPanel')
    },

    loadStore: function(me) {
        me.getStore().load()
    },

    reloadDeals: function (me) {
        Ext.getStore('botDealStore').reload()
    }
})