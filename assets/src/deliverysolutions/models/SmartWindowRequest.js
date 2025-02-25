exports.Size = class {
    constructor(height, width, length) {
        this.height = height;
        this.width = width;
        this.length = length;
    }
};

exports.ItemList = class {
    constructor(size, quantity, weight) {
        this.size = size instanceof exports.Size ? size : new exports.Size(); // Dimensions of the item. Refer Size function below.
        this.quantity = quantity; // Number of items. Defaults to 1.
        this.weight = weight; // Weight in pounds (lbs) of an item.
    }
};

exports.Options = class {
    constructor(itemList) {
        this.itemList = itemList instanceof exports.ItemList ? itemList : new exports.ItemList(itemList); // Some Providers requires items to fetch the Available Delivery Windows at their end. Refer ItemList function below.
    }
};

exports.SmartWindowRequest = class {
    constructor(storeExternalIds, categories, startDate, numberOfDays, dspCheck, types, provider, options) {
        this.storeExternalIds = Array.isArray(storeExternalIds) ? storeExternalIds.map(id => id instanceof string ? id : null) : []; // locationCodes
        this.categories = categories; // Defaults to all categories
        this.startDate = startDate; // Baseline date from which numberOfDays to be calculated. Defaults to current date.
        this.numberOfDays = numberOfDays; // Non-zero positive integer indicating how many days of windows to return. Defaults to 1.
        this.dspCheck = dspCheck; // Flag to indicate if the system should intelligently check top and bottom windows of each day to ensure DSP availability for the start and end. Uses location’s address/zipcode for the check against the DSPs. Default is false.
        this.types = types; // Type of window timings. Options are pickup, delivery or return. Defaults to type delivery.
        this.provider = provider; // Windows will be retrieved from the requested provider instead of matching windows configured at our end.
        this.options = options instanceof exports.Options ? options : new exports.Options(options); // Override default configured options. Refer Options function below.
    }
};