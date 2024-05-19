module.exports = {
    countOccurrences(campaignData, subscriberId, type) {
        let count = 0;
        
        if (type === 'receiver' && Array.isArray(campaignData)) {
            // Check if the subscriberId is included in the receiver array
            for (let receiver of campaignData) {
                if (receiver._id.toString() === subscriberId.toString()) {
                    count++;
                }
            }
            
        } else if (type === 'views' &&Array.isArray(campaignData) ) {
            // Check if the campaignData has a subscriber property
            for (let view of campaignData) {
                if (view.subscriber._id.toString() === subscriberId.toString()) {
                    count++;
                }
            }
            
        } else if (type === 'clicks' && Array.isArray(campaignData)) {
            // Check each click's subscriber ID in the data.clicks array
            for (let click of campaignData) {
                if (click.subscriber._id.toString() === subscriberId.toString()) {
                    count++;
                }
            }
        }
      
        return count;
    }
}
