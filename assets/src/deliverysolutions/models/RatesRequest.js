exports.DeliveryAddress = class {
    constructor(apartmentNumber, street, street2, city, state, zipcode, country, latitude, longitude) {
        this.apartmentNumber = apartmentNumber; // House Number / Apartment / Suite #
        this.street = street; // Address Line 1 (Street Number and Street Name).
        this.street2 = street2; // Address Line 2 (not to be used for apartment / suite #).
        this.city = city; // Name of city, town, village
        this.state = state; // 2-character State Code.
        this.zipcode = zipcode; // Required. Zip or postal code. For USA, 9 digit zipcodes are accepted, the first 5 digits are mandatory, the last 4 digits are optional.
        this.country = country; // 2-character country code ISO 3166-1 alpha-2. Defaults to US.
        this.latitude = latitude; // Latitude coordinates.
        this.longitude = longitude; // Longitude coordinates.
    }
};

exports.Time = class {
    constructor(startsAt, endsAt) {
        this.startsAt = startsAt; // Start of the window. Unix time in milliseconds. (conditional)
        this.endsAt = endsAt; // End of the window. Unix time in milliseconds. (conditional)
    }
};

exports.Item = class {
    constructor(sku, upc, quantity, size, weight, price, sale_price, image, title, description, itemAttributes, tags) {
        this.sku = sku; // Required. An ID that indicate/identify the product/variant from the brand’s catalog.
        this.upc = upc; // Universal Product Code for the item
        this.quantity = quantity; // Number of items of the SKU. Defaults to 1
        this.size = size instanceof exports.Size ? size : new exports.Size(); // Dimensions of the item. If not provided value will be considered as null to indicate not provided.
        this.weight = weight; // Weight in pounds (lbs) of an item. If not provided ,value will be considered as null to indicate not provided.
        this.price = price; // Retail price of the item. If not provided , value will be considered as null to indicate not provided.
        this.sale_price = sale_price; // Sale price of the item that can be used to indicate a different price from theprice. If not provided, will inherit the price. If not provided and can’t be inherited from price, value will be considered as null to indicate not provided.
        this.image = image; // Link to the image file of the item. Should be full public URL. File types accepted are JPG and PNG. If not provided, will inherit from catalog. If not provided and can’t be inherited from catalog, value will be considered as null to indicate not provided.
        this.title = title; // Title of the item. If not available , value will be considered as null to indicate not provided.
        this.description = description; // Description of the item. If not provided , value will be considered as null to indicate not provided.
        this.itemAttributes = itemAttributes; // JSON. Custom item attributes. If not provided , value will be assigned as null.
        this.tags = Array.isArray(tags) ? tags.map(tag => tag instanceof string ? tag : null) : []; // Addiitonal information, related to the item, can be added here
    }
};

exports.Option = class {
    constructor(allowOrchestration, displayWinningRates) {
        this.allowOrchestration = allowOrchestration; // If this option is set to true then rates will be send to the orchestration engine, which will filter the rates according the the orchestration rules.
        this.displayWinningRates = displayWinningRates; // This option decides whether to send all the rates or to send only the rates selected by the orchestration engine.
    }
};

exports.Size = class {
    constructor(height, width, length) {
        this.height = height; //Required. Height (in inches)
        this.width = width;  //Required. Width (in inches)
        this.length = length; //Required. Length (in inches)
    }
};

exports.PackageContent = class {
    constructor(isSpirit, isBeerOrWine, isTobacco, isFragile, isRx, hasPerishableItems) {
        this.isSpirit = isSpirit; // Checks whether package contains Spirit
        this.isBeerOrWine = isBeerOrWine; // Checks whether package contains Beer or Wine
        this.isTobacco = isTobacco; // Checks whether package contains Tobacco
        this.isFragile = isFragile; // Checks whether package contains Fragile items
        this.isRx = isRx; // Checks whether package contains RX
        this.hasPerishableItems = hasPerishableItems; // Checks whether package contains Perishable items
    }
};

exports.DSPackage = class {
    constructor(name, description, size, weight, quantity, items, itemList, temperatureControl, content, barcode) {
        this.name = name; // Required. Name of package created in our system (see Create Package.), or pass the value custom.
        this.description = description; // A brief description about the package contents.
        this.size = size instanceof exports.Size ? size : new exports.Size(); // height, width, length (in inches). If pre-configured package name is used, size is not required.
        this.weight = weight; // Weight of the package in pounds (lbs). If pre-configured package name is used, weight is not required. Defaults to 2.23
        this.quantity = quantity; // Required. Number of Packages. Defaults to 1.
        this.items = items; // Number of items in a single package. Default is 1.
        this.itemList = Array.isArray(itemList) ? itemList.map(item => item instanceof exports.Item ? item : new exports.Item()) : []; // Array of items in the package. In the absence of size, cubic dimensions and weight will be derived from this list.
        this.temperatureControl = temperatureControl; // Temperature information of the package
        this.content = content instanceof exports.PackageContent ? content : null; // Information about what the package contains
        this.barcode = barcode; // Barcode sent to the provider for scanning the packages
    }
};

exports.RatesRequest = class {
    constructor(deliveryAddress, storeExternalIds, type, orderValue, pickupTime, dropoffTime, options, packages, isSpirit, isBeerOrWine, isTobacco, isFragile, isRx, hasRefrigeratedItems, hasPerishableItems, itemList, matchProviderTags, orderAttributes, matchLocationTags, proposedProviders) {
        this.deliveryAddress = deliveryAddress instanceof exports.DeliveryAddress ? deliveryAddress : new exports.DeliveryAddress(); // Required. Address where the package will be delivered
        this.storeExternalIds = Array.isArray(storeExternalIds) ? storeExternalIds.map(id => id instanceof string ? id : null) : []; // Required. Array of Unique Id of the pickup locations.
        this.type = type; // This field is used to indicate preferred fulfillment type. If delivery/in-store-pickup/curbside/shipping are provided as the type, the system will provide rates to only those Providers that matches the type. If type is not specified, all available fulfilment options will be considered for rates.
        this.orderValue = orderValue; // Value of the order in dollars & cents. e.g., 10.00 or 116.50.
        this.pickupTime = pickupTime instanceof exports.Time ? pickupTime : new exports.Time(); // Check provider availability based on pickup time. If not provided, the system will use the appropriate time window. If pickupTime is null then it means that the package needs to be picked as soon as possible.
        this.dropoffTime = dropoffTime instanceof exports.Time ? dropoffTime : new exports.Time(); // Check provider availability based on drop-off time. If not provided, the system will use the appropriate time window. If dropoff time is null then it means that the package needs to be dropped off as soon as possible after the pickup.
        this.options = options instanceof exports.Option ? options : new exports.Option(); // Override default configured rate options set for the business.
        this.packages = Array.isArray(packages) ? packages.map(pkg => pkg instanceof exports.DSPackage ? pkg : new exports.DSPackage()) : []; // Package dimensions, weight and quantity details help in providing accurate estimates and winning providers. For shipping type orders, packages are converted to shipments with applicable providers
        this.isSpirit = isSpirit; // Flag to indicate if the order contains spirits.
        this.isBeerOrWine = isBeerOrWine; // Flag to indicate if the order contains beer or wine.
        this.isTobacco = isTobacco; // Flag to indicate if the order contains tobacco.
        this.isFragile = isFragile; // Flag to indicate if the order contains fragile items.
        this.isRx = isRx; // Flag to indicate if the order contains prescription items.
        this.hasRefrigeratedItems = hasRefrigeratedItems; // Flag to indicate if the order contains refrigerated items.
        this.hasPerishableItems = hasPerishableItems; // Flag to indicate if the order contains perishable items.
        this.itemList = Array.isArray(itemList) ? itemList.map(item => item instanceof exports.Item ? item : new exports.Item()) : []; // Items in the order.
        this.matchProviderTags = Array.isArray(matchProviderTags) ? matchProviderTags.map(matchProviderTag => matchProviderTag instanceof string ? matchProviderTag : null) : []; // Rates for providers matching at least one tag from the requested tags are returned.
        this.orderAttributes = orderAttributes; // JSON. Configurable key-value pairs of custom order attributes.
        this.matchLocationTags = Array.isArray(matchLocationTags) ? matchLocationTags.map(matchLocationTag => matchLocationTag instanceof string ? matchLocationTag : null) : []; // Rates for locations matching at least one tag from the requested location tags, are returned.
        this.proposedProviders = proposedProviders; // Override orchestration and get rates with the specified Provider and Service.
    }
};