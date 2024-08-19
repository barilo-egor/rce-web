Ext.define('Dashboard.view.deal.api.ApiDealsUserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'apidealsuserinfopanel',
    reference: 'apiDealsUserInfoPanel',

    title: 'Пользователь',

    collapsible: ExtUtilConfig.getCollapsible('right'),
    titleCollapse: false,
    collapsed: true,

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
            reference: 'apiUserInfoFieldsContainer',
            hidden: true,
            padding: '15 15 15 15',
            scrollable: true,

            getFieldsReferences: function () {
                if (!this.fieldsReferences) {
                    ExtUtil.setFieldsReferences(this)
                }
                return this.fieldsReferences
            },

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
                    },
                    setUserValue: function (user) {
                        this.setValue(user.id)
                    }
                },
                {
                    label: 'Количество проведенных сделок',
                    reference: 'dealsCountDisplayField',
                    setUserValue: function (user) {
                        this.setValue(user.dealsCount)
                    }
                },
                {
                    label: 'Бан',
                    reference: 'isBannedDisplayField',
                    setUserValue: function (user) {
                        this.setValue(user.isBanned ? 'Да' : 'Нет')
                    }
                },
                {
                    label: 'Персональная скидка',
                    reference: 'personalDiscountDisplayField',
                    setUserValue: function (user) {
                        this.setValue((user.personalDiscount ? user.personalDiscount : '0') + '%')
                    }
                },
                {
                    label: 'Курс доллара BYN',
                    reference: 'bynUsdCourseDisplayField',
                    setUserValue: function (user) {
                        this.setValue(user.bynUsdCourse ? user.bynUsdCourse : 'Отсутствует')
                    }
                },
                {
                    label: 'Курс доллара RUB',
                    reference: 'rubUsdCourseDisplayField',
                    setUserValue: function (user) {
                        this.setValue(user.rubUsdCourse ? user.rubUsdCourse : 'Отсутствует')
                    }
                },
                {
                    label: 'Дата регистрации',
                    reference: 'registrationDateDisplayField',
                    setUserValue: function (user) {
                        this.setValue(user.registrationDate)
                    }
                }
            ]
        }
    ]
})