Ext.define('Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsPanel', {
    extend: 'Ext.Panel',
    xtype: 'securepaymentdetailspanel',

    title: 'Защитные реквизиты',
    shadow: true,

    layout: 'fit',
    items: [
        {
            xtype: 'grid',

            columns: [
                {
                    text: 'Кол-во сделок',
                    dataIndex: 'minDealCount',
                    width: 120
                },
                {
                    flex: 1,
                    text: 'Реквизит',
                    dataIndex: 'details'
                }
            ]
        }
    ]
})