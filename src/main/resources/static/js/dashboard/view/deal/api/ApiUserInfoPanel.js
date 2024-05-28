Ext.define('Dashboard.view.deal.api.ApiUserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiuserinfopanel',
    reference: 'apiUserInfoPanel',

    title: 'Пользователь',

    collapsible: {
        direction: 'right',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    titleCollapse: false,
    collapsed: true,
    openable: 1,
    layout: 'fit',
    items: [
        {
            xtype: 'container',
            reference: 'chooseDealContainer',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'component',
                    html: 'Выберите сделку'
                }
            ]
        },
        {
            xtype: 'container',
            reference: 'userInfoFieldsContainer',
            hidden: true,
            padding: '15 15 15 15',
            scrollable: true,

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'displayfield'
            },
            items: [
                {
                    xtype: 'textfield',
                    editable: false,
                    label: 'ID',
                    triggers: null,
                    reference: 'idDisplayField',
                    listeners: {
                        focus: function () {
                            navigator.clipboard.writeText(this.getValue())
                            ExtMessages.topToast('ID скопирован в буфер обмена')
                        }
                    }
                },
                {
                    label: 'Количество проведенных сделок',
                    reference: 'dealsCountDisplayField'
                },
                {
                    label: 'Бан',
                    reference: 'isBannedDisplayField'
                },
                {
                    label: 'Персональная скидка',
                    reference: 'personalDiscountDisplayField'
                },
                {
                    label: 'Реквизит покупки',
                    reference: 'buyRequisiteDisplayField'
                },
                {
                    label: 'Реквизит продажи',
                    reference: 'sellRequisiteDisplayField'
                },
                {
                    label: 'Курс доллара BYN',
                    reference: 'bynUsdCourseDisplayField'
                },
                {
                    label: 'Курс доллара RUB',
                    reference: 'rubUsdCourseDisplayField'
                },
                {
                    label: 'Дата регистрации',
                    reference: 'registrationDateDisplayField'
                }
            ]
        }
    ]
})