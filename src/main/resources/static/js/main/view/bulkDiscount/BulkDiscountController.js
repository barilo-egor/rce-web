Ext.define('Main.view.bulkDiscount.BulkDiscountController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.bulkDiscountController',
    requires: [
        'Main.view.bulkDiscount.BulkDiscountGridPanel',
        'Main.view.bulkDiscount.BulkDiscountAddForm'
    ],
    bulkDiscountsAfterRender: function () {
        let me = this;
        let discountsTabPanel = Ext.ComponentQuery.query('[id=discountsTabPanel]')[0];
        Ext.Ajax.request({
            url: '/web/bulkDiscount/getDiscounts',
            method: 'GET',
            async: false,
            success: function (rs) {
                let response = Ext.JSON.decode(rs.responseText);
                let data = response.data;
                for (let fiatCurrency of data) {
                    discountsTabPanel.insert(me.createGridPanel(fiatCurrency));
                }
                discountsTabPanel.setActiveTab(0);
            }
        })
    },

    createGridPanel: function (fiatCurrency) {
        let fiatCurrencyTabPanel = {
            title: fiatCurrency.name,
            layout: {
                type: 'fit'
            },
            items: [
                {
                    xtype: 'tabpanel',
                    items: []
                }
            ]
        };
        for (let dealType of fiatCurrency.dealTypes) {
            let dealTypeTabPanel = {
                title: dealType.displayName,
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'tabpanel',
                        items: []
                    }
                ]
            };
            for (let cryptoCurrency of dealType.cryptoCurrencies) {
                let store = Ext.create('Main.view.bulkDiscount.store.BulkDiscountStore');
                for (let bulkDiscount of cryptoCurrency.bulkDiscounts) {
                    bulkDiscount.fiatCurrency = fiatCurrency.name;
                    bulkDiscount.dealType = dealType.name;
                    bulkDiscount.cryptoCurrency = cryptoCurrency.name
                }
                store.getProxy().setData(cryptoCurrency.bulkDiscounts);
                store.load();
                let cryptoCurrencyTabPanel = {
                    title: cryptoCurrency.name,
                    layout: {
                        type: 'fit'
                    },
                    items: [
                        {
                            xtype: 'bulkdiscountgridpanel',
                            store: store,
                            fiatCurrency: fiatCurrency.name,
                            dealType: dealType.name,
                            cryptoCurrency: cryptoCurrency.name
                        }
                    ]
                };
                dealTypeTabPanel.items[0].items.push(cryptoCurrencyTabPanel);
            }
            fiatCurrencyTabPanel.items[0].items.push(dealTypeTabPanel);
        }
        return fiatCurrencyTabPanel;
    },

    onSaveClick: function (btn) {
        let me = this;
        let oldSum = ExtUtil.idQuery('oldSum').getValue();
        let bulkDiscount = {
            sum: ExtUtil.idQuery('sum').getValue(),
            percent: ExtUtil.idQuery('percent').getValue(),
            fiatCurrency: ExtUtil.idQuery('fiatCurrency').getValue(),
            dealType: ExtUtil.idQuery('dealType').getValue(),
            cryptoCurrency: ExtUtil.idQuery('cryptoCurrency').getValue(),
        };
        me.saveDiscountRequest(bulkDiscount, oldSum);
        btn.up('window').close();
    },

    saveDiscountRequest: function (bulkDiscount, oldSum) {
        let me = this;
        let requestBody = {
            url: '/web/bulkDiscount/saveDiscount',
            method: 'POST',
            jsonData: bulkDiscount,
            success: function () {
                for (let grid of Ext.ComponentQuery.query('grid')) {
                    if (grid.fiatCurrency === bulkDiscount.fiatCurrency && grid.dealType === bulkDiscount.dealType
                        && grid.cryptoCurrency === bulkDiscount.cryptoCurrency) {
                        let store = grid.getStore();
                        let recs = store.getData().getRange();
                        if (oldSum) {
                            for (let rec of recs) {
                                if (rec.getData().sum === oldSum) {
                                    rec.data.percent = bulkDiscount.percent;
                                    if (bulkDiscount.sum !== oldSum) {
                                        rec.data.sum = bulkDiscount.sum;
                                    }
                                    store.add(rec);
                                    break;
                                }
                            }
                        } else {
                            let newRec = new Main.view.bulkDiscount.model.BulkDiscountModel({
                                sum: bulkDiscount.sum,
                                percent: bulkDiscount.percent,
                                fiatCurrency: bulkDiscount.fiatCurrency,
                                dealType: bulkDiscount.dealType,
                                cryptoCurrency: bulkDiscount.cryptoCurrency
                            });
                            store.add(newRec);
                        }
                        let sortersItems = store.getSorters().items;
                        if (sortersItems.length !== 0) {
                            store.sort('sum', sortersItems[0]._direction);
                        } else {
                            store.sort('sum', 'DESC');
                        }
                        break;
                    }
                }
                Ext.Msg.alert('Информация', 'Скидка сохранена.');
            },
            failure: function () {
                Ext.Msg.alert('Ошибка', 'При сохранении произошли ошибки.')
            }
        };
        if (oldSum) requestBody.params = {
            oldSum: oldSum
        }
        Ext.Ajax.request(requestBody);
    },

    onAddClick: function (btn) {
        let grid = btn.up('grid');
        Ext.widget('bulkdiscountaddform', {
            viewModel: {
                data: {
                    fiatCurrency: grid.fiatCurrency,
                    dealType: grid.dealType,
                    cryptoCurrency: grid.cryptoCurrency
                }
            },
        }).show()
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {
        let grid = view.up('grid');
        Ext.widget('bulkdiscountaddform', {
            viewModel: {
                data: {
                    oldSum: record.data.sum,
                    sum: record.data.sum,
                    percent: record.data.percent,
                    fiatCurrency: grid.fiatCurrency,
                    dealType: grid.dealType,
                    cryptoCurrency: grid.cryptoCurrency
                }
            },
        }).show()
    },

    onRemoveClick: function(view, recIndex, cellIndex, item, e, record) {
        let bulkDiscount = {
            sum: record.data.sum,
            fiatCurrency: record.data.fiatCurrency,
            dealType: record.data.dealType,
            cryptoCurrency: record.data.cryptoCurrency
        };
        Ext.Ajax.request({
            url: '/web/bulkDiscount/removeDiscount',
            method: 'DELETE',
            jsonData: bulkDiscount,
            success: function () {
                record.drop();
                Ext.Msg.alert('Информация', 'Скидка удалена.');
            },
            failure: function () {
                Ext.Msg.alert('Ошибка', 'При удалении произошли ошибки.')
            }
        });
    },

})