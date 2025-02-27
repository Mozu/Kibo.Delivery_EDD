exports.Rate = class {
    constructor(type, provider, serviceType, serviceId, deliveryWindowId, deliveryWindows, requestedPickupTime, requestedPickupTimeEnds, requestedDropoffTime, requestedDropoffTimeEnds, estimatedPickupTime, estimatedPickupTimeStarts, estimatedPickupTimeEnds, estimatedDeliveryTime, estimatedDeliveryTimeStarts, estimatedDeliveryTimeEnds, expires, currencyCode, currency, amount, fee, chargeDetails, ruleApplied, noEstimate, orderType, supportsAlternateLocation, code, tags, storeExternalId) {
        this.type = type; // Type of rate
        this.provider = provider; // Provider of the rate
        this.serviceType = serviceType; // Type of service
        this.serviceId = serviceId; // Service ID
        this.deliveryWindowId = deliveryWindowId; // Delivery Window ID
        this.deliveryWindows = deliveryWindows; // Array of delivery windows
        this.requestedPickupTime = requestedPickupTime; // Requested Pickup Time
        this.requestedPickupTimeEnds = requestedPickupTimeEnds; // Requested Pickup Time Ends
        this.requestedDropoffTime = requestedDropoffTime; // Requested Dropoff Time
        this.requestedDropoffTimeEnds = requestedDropoffTimeEnds; // Requested Dropoff Time Ends
        this.estimatedPickupTime = estimatedPickupTime; // Estimated Pickup Time
        this.estimatedPickupTimeStarts = estimatedPickupTimeStarts; // Estimated Pickup Time Starts
        this.estimatedPickupTimeEnds = estimatedPickupTimeEnds; // Estimated Pickup Time Ends
        this.estimatedDeliveryTime = estimatedDeliveryTime; // Estimated Delivery Time
        this.estimatedDeliveryTimeStarts = estimatedDeliveryTimeStarts; // Estimated Delivery Time Starts
        this.estimatedDeliveryTimeEnds = estimatedDeliveryTimeEnds; // Estimated Delivery Time Ends
        this.expires = expires; // Expiry time of the rate
        this.currencyCode = currencyCode; // Currency Code
        this.currency = currency; // Currency
        this.amount = amount; // Amount
        this.fee = fee; // Fee
        this.chargeDetails = chargeDetails; // Charge Details
        this.ruleApplied = ruleApplied; // Rule Applied
        this.noEstimate = noEstimate; // No Estimate
        this.orderType = orderType; // Order Type
        this.supportsAlternateLocation = supportsAlternateLocation; // Supports Alternate Location
        this.code = code; // Code
        this.tags = tags; // Tags
        this.storeExternalId = storeExternalId; // Store External ID. i.e. locationCode
    }
};

exports.Error = class {
    constructor(type, message, parameter) {
        this.type = type; // Type of error
        this.message = message; // Error message
        this.parameter = parameter; // Parameter
    }
};

exports.RatesResponse = class {
    constructor(rates, errors, rateId){
        this.rates = Array.isArray(rates) ? rates.map(rate => rate instanceof exports.Rate ? rate : null) : []; // Array of rates
        this.errors = Array.isArray(errors) ? errors.map(error => error instanceof exports.Error ? error : null) : []; // Array of errors
        this.rateId = rateId; // Rate ID
    }
};