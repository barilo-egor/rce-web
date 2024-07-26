Ext.define('ApiDashboard.view.grid.CreateDisputeDialog', {
    extend: 'Ext.Dialog',
    requires: [
        'ApiDashboard.view.grid.CreateDisputeController'
    ],
    controller: 'createDisputeController',
    title: 'Создание диспута',
    closable: true,
    width: 750,

    listeners: {
        show: 'setPasteHandler',
        close: 'dropPasteHandler'
    },

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            width: '100%',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 0.25,
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.33,
                            margin: '0 20 0 20',
                            xtype: 'numberfield',
                            width: '50%',
                            label: 'Фиатная сумма',
                        },
                        {
                            flex: 0.66,
                            margin: '0 20 0 20',
                            xtype: 'textfield',
                            label: 'Реквизит'
                        }
                    ]
                },
                {
                    flex: 0.75,
                    xtype: 'container',

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.33,
                            xtype: 'container',
                            margin: '0 20 0 20',

                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    label: 'Фиатная валюта',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'displayName',
                                    store: {
                                        type: 'fiatCurrenciesStore',
                                        listeners: {
                                            load: 'setDefaultFiat'
                                        }
                                    },
                                    reference: 'fiatCurrencyDisputeField'
                                },
                                {
                                    xtype: 'combobox',
                                    label: 'Тип сделки',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'nominativeFirstUpper',
                                    store: {
                                        type: 'dealTypesStore',
                                        listeners: {
                                            load: 'setDefaultDealType'
                                        }
                                    },
                                    reference: 'dealTypeDisputeField',
                                },
                                {
                                    xtype: 'combobox',
                                    label: 'Криптовалюта',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'name',
                                    store: {
                                        type: 'cryptoCurrenciesStore',
                                        listeners: {
                                            load: 'setDefaultCrypto'
                                        }
                                    },
                                    reference: 'cryptoCurrencyDisputeField',
                                }
                            ]
                        },
                        {
                            flex: 0.66,
                            xtype: 'container',
                            margin: '0 20 0 20',

                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    title: 'Чек',
                                    reference: 'checkField',
                                    margin: '20 0 0 0',
                                    width: '95%',
                                    height: 160,

                                    buttons: [
                                        {
                                            text: 'Из буфера обмена',
                                            handler: 'showPrevious',
                                            reference: 'card-prev',
                                            disabled: true
                                        },
                                        {
                                            text: 'Выбрать на компьютере',
                                            reference: 'card-next',
                                            handler: 'showNext'
                                        }
                                    ],

                                    layout: {
                                        type: 'card'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'vbox',
                                                align: 'center',
                                                pack: 'middle'
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    reference: 'checkBufferContainer',
                                                    html: '<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'vbox',
                                                align: 'center',
                                                pack: 'middle'
                                            },
                                            items: [
                                                {
                                                    xtype: 'filefield',
                                                    label: 'Выберите изображение',
                                                    reference: 'checkFileField',
                                                    width: '97%',
                                                    accept: 'image/*,.pdf',
                                                    listeners: {
                                                        painted: 'setBrowseButtonText'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            reference: 'createButton',
            margin: '20 0 0 0',
            text: 'Создать',
            handler: 'createDispute'
        }
    ]
});
