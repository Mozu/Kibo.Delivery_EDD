exports.Content = class {
    constructor(localeCode, name) {
        this.localeCode = localeCode;
        this.name = name;
    }
};

exports.ShippingItemRate = class {
    constructor(itemId, quantity, amount) {
        this.itemId = itemId;
        this.quantity = quantity;
        this.amount = amount;
    }
};

exports.Window = class{
    constructor(pickupTime, dropoffTime) {
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
    }
};

exports.ShippingRateValidationMessage = class {
    constructor(helpLink, message, severity) {
        this.helpLink = helpLink;
        this.message = message;
        this.severity = severity;
    }
};

exports.ShippingRate = class {
    constructor(code, content, amount, daysInTransit, shippingItemRates, customAttributes, messages, data, windows) {
        this.code = code;
        this.content = content instanceof exports.Content ? content : new exports.Content();
        this.amount = amount;
        this.daysInTransit = daysInTransit;
        this.shippingItemRates = Array.isArray(shippingItemRates) ? shippingItemRates.map(rate => rate instanceof exports.ShippingItemRate ? rate : new exports.ShippingItemRate()) : [];
        this.customAttributes = customAttributes;
        this.messages = Array.isArray(messages) ? messages.map(message => message instanceof exports.ShippingRateValidationMessage ? message : new exports.ShippingRateValidationMessage()) : [];
        this.data = data;
        this.windows = Array.isArray(windows) ? windows.map(window => window instanceof exports.Window ? window : new exports.Window()) : [];
    }
};

exports.Rate = class {
    constructor(carrierId, shippingRates, fulfillmentMethod, customAttributes){
        this.carrierId = carrierId;
        this.shippingRates = Array.isArray(shippingRates) ? shippingRates.map(rate => rate instanceof exports.ShippingRate ? rate : new exports.ShippingRate()) : [];
        this.fulfillmentMethod = 'Delivery';
        this.customAttributes = customAttributes;
    }
};

exports.GetRatesResponse = class {
    constructor(carrierRatesResponses) {
        this.carrierRatesResponses = Array.isArray(carrierRatesResponses) ? carrierRatesResponses.map(rate => rate instanceof exports.Rate ? rate : new exports.Rate()) : [];
    }
};