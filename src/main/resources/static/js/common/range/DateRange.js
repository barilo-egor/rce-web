Ext.define('Common.range.DateRange', {
    extend: 'Ext.Container',
    xtype: 'daterange',

    layout: {
        type: 'hbox',
        align: 'bottom'
    },
    getValue: function () {
        let items = this.getItems().items
        let startDateField = items[0]
        let endDateField = items[1]
        let rangeField = items[2]
        let result = {}
        result.startDate = Ext.Date.format(startDateField.getValue(), "Y-m-d")
        if (rangeField.getValue()) {
            result.isRange = true
            result.endDate = Ext.Date.format(endDateField.getValue(), "Y-m-d")
        } else result.isRange = false
        return result
    },

    clearValue() {
        let items = this.getItems().items
        items[0].clearValue()
        items[1].clearValue()
        items[2].setValue(items[2].getStore().getAt(0))
    },

    items: [
        {
            flex: 1,
            xtype: 'datefield',
            dateFormat: 'd.m.Y',
            label: 'Дата',
            margin: '0 15 0 0',
            clearable: true,
            listeners: {
                painted: function (me) {
                    let container = me.up('daterange')
                    if (container.dateFieldChangeListener) {
                        me.on('change', container.dateFieldChangeListener)
                    }
                }
            }
        },
        {
            flex: 1,
            xtype: 'datefield',
            dateFormat: 'd.m.Y',
            label: 'Дата до',
            margin: '0 15 0 0',
            clearable: true,
            listeners: {
                painted: function (me) {
                    let container = me.up('daterange')
                    if (container.dateFieldChangeListener) {
                        me.on('change', container.dateFieldChangeListener)
                    }
                }
            }
        },
        {
            flex: 0.2,
            xtype: 'combobox',
            displayField: 'text',
            valueField: 'value',
            minWidth: 90,
            store: {
                fields: ['text', 'value'],
                data: [
                    {
                        text: 'Равна',
                        value: false
                    },
                    {
                        text: 'Диапазон',
                        value: true
                    }
                ]
            },
            listeners: {
                painted: function (me) {
                    me.setValue(me.getStore().getAt(0))
                },
                change: function (me, newValue) {
                    let startDateField = me.up('container').getItems().items[0]
                    let endDateField = me.up('container').getItems().items[1]
                    if (newValue) {
                        startDateField.setLabel('Дата от')
                        endDateField.show()
                    } else {
                        startDateField.setLabel('Дата')
                        endDateField.hide()
                        endDateField.clearValue()
                        if (endDateField.getValue()) endDateField.clearValue()
                    }
                }
            }
        }
    ]
})