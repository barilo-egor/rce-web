Ext.define('Dashboard.view.paymentTypes.api.requisite.ApiRequisitesGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apirequisitesgridmenu',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.EditApiRequisiteDialog'
    ],

    items: [
        {
            text: 'Редактировать',
            iconCls: 'x-fa fa-pen',
            handler: function (me) {
                Ext.create('Dashboard.view.paymentTypes.api.requisite.EditApiRequisiteDialog', {
                    viewModel: {
                        data: {
                            requisitePid: ExtUtil.referenceQuery('apiRequisitesGrid').getPidOfSelected(),
                            requisite: ExtUtil.referenceQuery('apiRequisitesGrid').getRequisiteOfSelected(),
                            comment: ExtUtil.referenceQuery('apiRequisitesGrid').getCommentOfSelected(),
                        }
                    }
                }).show()
            }
        },
        {
            text: 'Удалить',
            reference: 'copyRequisiteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                ExtUtil.mask('apiRequisitesGrid')
                let url = '/paymentTypes/api/requisite/' + ExtUtil.referenceQuery('apiRequisitesGrid').getPidOfSelected()
                RequestUtil.request({
                    url: url,
                    method: 'DELETE',
                    masked: 'apiClientsGrid',
                    success: function () {
                        Ext.getStore('apiPaymentTypeStore').reload()
                        ExtMessages.topToast('Реквизит удален')
                        ExtUtil.maskOff('apiClientsGrid')
                    }
                })
            }
        }
    ]
})