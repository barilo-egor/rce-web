Ext.define('ApiDashboard.view.grid.DealFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'dealfilterpanel',
    reference: 'dealFilterPanel',

    shadow: true,
    header: false,
    collapsible: {
        direction: 'top',
        tool: null
    },

    padding: '0 20 30 20',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },
    items: [
        {
            items: [
                {
                    xtype: 'container',
                    reference: 'pidFilterField',
                    getValue: function () {
                        let numberFrom = this.getItems().items[0].getValue()
                        let numberTo = this.getItems().items[1].getValue()
                        if (!numberFrom && !numberTo) return null
                        return {
                            numberFrom: numberFrom,
                            numberTo: numberTo
                        }
                    },

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.5,
                            xtype: 'textfield',
                            label: 'Номер заявки от',
                            margin: '0 20 0 20',
                            listeners: {
                                change: function() {
                                    Ext.getStore('dealStore').loadPage(1)
                                }
                            }
                        },
                        {
                            flex: 0.5,
                            xtype: 'textfield',
                            label: 'Номер заявки до',
                            margin: '0 20 0 20',
                            listeners: {
                                change: function() {
                                    Ext.getStore('dealStore').loadPage(1)
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'daterange',
                    reference: 'dateFilterField',
                    margin: '0 20 0 20',
                    dateFieldChangeListener: function() {
                        Ext.getStore('dealStore').loadPage(1)
                    }
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Фиатная валюта',
                    displayField: 'code',
                    store: {
                        type: 'fiatCurrenciesStore'
                    },
                    reference: 'fiatCurrencyFilterField',
                    margin: '0 20 0 20',
                    listeners: {
                        change: function() {
                            Ext.getStore('dealStore').loadPage(1)
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Криптовалюта',
                    displayField: 'shortName',
                    store: {
                        type: 'cryptoCurrenciesStore'
                    },
                    reference: 'cryptoCurrencyFilterField',
                    margin: '0 20 0 20',
                    listeners: {
                        change: function() {
                            Ext.getStore('dealStore').loadPage(1)
                        }
                    }
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Тип сделки',
                    displayField: 'nominative',
                    store: {
                        type: 'dealTypesStore'
                    },
                    reference: 'dealTypeFilterField',
                    margin: '0 20 0 20',
                    listeners: {
                        change: function() {
                            Ext.getStore('dealStore').loadPage(1)
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    label: 'Статус',
                    displayField: 'description',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    store: {
                        type: 'apiDealStatusesStore'
                    },
                    reference: 'apiDealStatusFilterField',
                    margin: '0 20 0 20',
                    listeners: {
                        change: function() {
                            Ext.getStore('dealStore').loadPage(1)
                        }
                    }
                }
            ]
        }
    ]
})