const PUBLISHED_REVIEW_STORE_ID = 'publishReviewStore'
Ext.define('Dashboard.store.deal.review.PublishedReviewStore', {
    extend: 'Ext.data.Store',
    storeId: PUBLISHED_REVIEW_STORE_ID,
    pageSize: 0,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});