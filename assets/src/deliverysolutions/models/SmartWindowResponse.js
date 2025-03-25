module.exports = class SmartWindowResponse {
    constructor(message, data) {
        this.message = message;
        this.data = Array.isArray(data) ? windows.map(d => d instanceof exports.Data ? d : new exports.Data(d)) : [];
    }
};

exports.Data = class {
    constructor(storeExternalId, timeZone, delivery) {
        this.storeExternalId = storeExternalId;
        this.timeZone = timeZone;
        this.delivery = delivery instanceof exports.Delivery ? delivery : new exports.Delivery(delivery);
    }
};

exports.Delivery = class {
    constructor(category, pickAndPack, date, windows) {
        this.category = category;
        this.pickAndPack = pickAndPack;
        this.date = date;
        this.windows = Array.isArray(windows) ? windows.map(window => window instanceof exports.Window ? window : new exports.Window(window)) : [];
    }
};

exports.Window = class {
    constructor(pickupTime, dropoffTime, tz, windowId, provider, available) {
        this.pickupTime = pickupTime instanceof exports.PickupTime ? pickupTime : new exports.PickupTime(pickupTime);
        this.dropoffTime = dropoffTime instanceof exports.DropoffTime ? dropoffTime : new exports.DropoffTime(dropoffTime);
        this.tz = tz;
        this.windowId = windowId;
        this.provider = provider;
        this.available = available;
    }
};

exports.PickupTime = class {
    constructor(startsAt) {
        this.startsAt = startsAt;
    }
};

exports.DropoffTime = class {
    constructor(startsAt, endsAt) {
        this.startsAt = startsAt;
        this.endsAt = endsAt;
    }
};