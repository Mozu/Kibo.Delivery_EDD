exports.TransitTimesResponse = class {
    constructor(carrierTransitTimes) {
        this.transitTimes = Array.isArray(carrierTransitTimes) ? carrierTransitTimes.map(x => x instanceof exports.CarrierTransitTime ? x : null) : [];
    }
};

exports.CarrierTransitTime = class {
    constructor(carrierId, estimatedDeliveryDates) {
        this.carrierId = carrierId;
        this.estimatedDeliveryDates = Array.isArray(estimatedDeliveryDates) ? estimatedDeliveryDates.map(x => x instanceof exports.EstimatedDeliveryDate ? x : null) : [];
    }
};

exports.EstimatedDeliveryDate = class {
    constructor(fulfillmentMethod, shippingMethod, timeZone, deliveryDate, windows) {
        this.fulfillmentMethod = fulfillmentMethod;
        this.shippingMethod = shippingMethod;
        this.timeZone = timeZone;
        this.deliveryDate = deliveryDate;
        this.windows = Array.isArray(windows) ? windows.map(x => x instanceof exports.Window ? x : null) : [];
    }
};

exports.Window = class {
    constructor(pickupTime, dropoffTime) {
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
    }
};