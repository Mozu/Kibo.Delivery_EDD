exports.TransitTimesResponse = class {
    constructor(carrierTransitTimes) {
        this.transitTimes = Array.isArray(carrierTransitTimes) ? carrierTransitTimes.map(x => x instanceof exports.CarrierTransitTime ? x : null) : [];
    }
};

exports.CarrierTransitTime = class {
    constructor(carrierId, estimatedDeliveryDates, itemIds) {
        this.carrierId = carrierId;
        this.estimatedDeliveryDates = Array.isArray(estimatedDeliveryDates) ? estimatedDeliveryDates.map(x => x instanceof exports.EstimatedDeliveryDate ? x : null) : [];
        this.itemIds = itemIds;
    }
};

exports.EstimatedDeliveryDate = class {
    constructor(fulfillmentMethod, shippingMethod, timeZone, deliveryDate, windows, messages) {
        this.fulfillmentMethod = fulfillmentMethod;
        this.shippingMethod = shippingMethod;
        this.timeZone = timeZone;
        this.deliveryDate = deliveryDate;
        this.windows = Array.isArray(windows) ? windows.map(x => x instanceof exports.Window ? x : null) : [];
        this.messages = messages;
    }
};

exports.Window = class {
    constructor(pickupTime, dropoffTime) {
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
    }
};

//converts DeliverySolutions epoch offsets to utc datetimes which kibo wants for these fields
//TODO verify proper utc format
exports.TimeWindow = class {
  constructor(startsAt, endsAt) {

    function convertEpochToCSharpDateTime(epochOffset) {
      // Convert epoch offset to JavaScript Date object
      const date = new Date(epochOffset); // Multiply by 1000 to convert seconds to milliseconds

      // Format the date to C# DateTime format (e.g., "yyyy-MM-ddTHH:mm:ss.fffZ", "2019-10-23T06:55:32.426Z")
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }

    var startDate = null;
    if(startsAt !== null && startsAt !== undefined){
      startDate = convertEpochToCSharpDateTime(startsAt);
    }

    var endDate = null;
    if(endsAt !== null && endsAt !== undefined){
      endDate = convertEpochToCSharpDateTime(endsAt);
    }
    this.startsAt = startDate;
    this.endsAt = endDate;
  }
};

exports.ValidationMessage = class {
  constructor(severity, message, helpLink) {
    this.severity = severity;
    this.message = message;
    this.helpLink = helpLink;
  }
};


