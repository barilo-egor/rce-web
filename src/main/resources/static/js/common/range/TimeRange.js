Ext.define('Common.range.TimeRange', {
    extend: 'Ext.Container',
    xtype: 'timerange',

    layout: {
        type: 'hbox',
        align: 'bottom'
    },
    getValue: function () {
        let items = this.getItems().items
        let startTimeField = items[0]
        let endTimeField = items[1]
        let rangeField = items[2]
        let result = {}
        result.startTime = startTimeField.getValue()
        if (rangeField.getValue()) {
            result.isRange = true
            result.endTime = endTimeField.getValue()
        } else result.isRange = false
    },

    items: [
        {
            flex: 1,
            xtype: 'textfield',
            label: 'Время',
            margin: '0 15 0 0',
            inputMask: '99:99:99'
        },
        {
            flex: 1,
            xtype: 'textfield',
            label: 'Время до',
            margin: '0 15 0 0',
            inputMask: '99:99:99'
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
                        text: 'Равно',
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
                    let startTimeField = me.up('container').getItems().items[0]
                    let endTimeField = me.up('container').getItems().items[1]
                    if (newValue) {
                        startTimeField.setLabel('Время от')
                        endTimeField.show()
                    } else {
                        startTimeField.setLabel('Время')
                        endTimeField.hide()
                        endTimeField.clearValue()
                        if (endTimeField.getValue()) endTimeField.clearValue()
                    }
                }
            }
        }
    ]
})