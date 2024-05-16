module.exports = {
    countOccurrences(campaignData, subscriberId, type) {
        let count = 0;
        if (type === 'receiver' && Array.isArray(campaignData)) {
            // Check if the subscriberId is included in the receiver array
            for (let receiver of campaignData) {
                if (receiver.email === subscriberId.email) {
                    count++;
                }
            }
            
        } else if (type === 'views' &&Array.isArray(campaignData) ) {
            // Check if the campaignData has a subscriber property
            for (let view of campaignData) {
                if (view.subscriber.email === subscriberId.email) {
                    count++;
                }
            }
            
        } else if (type === 'clicks' && Array.isArray(campaignData)) {
            // Check each click's subscriber ID in the data.clicks array
            for (let click of campaignData) {
                if (click.subscriber.email === subscriberId.email) {
                    count++;
                }
            }
        }
      
        return count;
    }
}
