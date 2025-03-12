const { SmartWindowRequest } = require('../../deliverysolutions/models/SmartWindowRequest');
const { RatesRequest, Item, DSPackage } = require('../../deliverysolutions/models/RatesRequest');
const { RatesResponse } = require('../../deliverysolutions/models/RatesResponse');
const { Data } = require('../../deliverysolutions/models/SmartWindowResponse');
const { TransitTimesResponse, CarrierTransitTime, EstimatedDeliveryDate, Window, TimeWindow } = require('../../models/TransitTimesResponse');
const { GetRatesResponse, Rate, ShippingRate, ShippingRateValidationMessage } = require('../../models/GetRatesResponse');
const { DeliverySolutionsSdk } = require('../../deliverysolutions/deliverysolutionssdk');
const { FULFILLMENT_METHOD_DELIVERY, FULFILLMENT_METHOD_SHIP } = require('../../constants');

module.exports = function (context, callback) {
    route(context, callback)
        .then(response => callback(null, response))
        .catch(error => callback(error));
};

async function route(context, callback) {

    const request = context.get.request();
    const method = context.get.method();

    const requestContext = request.context;
    const requestPayload = request.request;

    if (method === 'transit-times') {
        return await getTransitTimes(requestContext, requestPayload);
    }
    else if (method === 'rates') {
        return await getRates(requestContext, requestPayload);
    }
}

async function getTransitTimes(requestContext, requestPayload) {

    //TODO is ffmtMethod at item or parent level?
    //TODO     Assuming parent level rn bc OR said every item would have same ffmtMethod for their usecase
    //This application supports delivery fulfillment
    if (requestPayload.fulfillmentMethod.toLowerCase() != FULFILLMENT_METHOD_DELIVERY) {
        //if request doesnt want Delivery, return empty list
        return new TransitTimesResponse([]);
    }

    console.debug('--------------requestPayload-------------------');
    console.debug(requestPayload);

    var smartWindowPayloads = getSmartWindowPayloads(requestPayload);

    console.debug('got smartwindowpayloads');
    //return new TransitTimesResponse([]);

    var client = getDeliverySolutionsClient(requestContext.credentials);

    var allResponses = await getSmartWindows(client, smartWindowPayloads);

    console.debug('got allresponses');

    //TODO foreach allResponses getTransitTimesResponse and stitch them together
    //TODO do i need to compare item responses to see if windows are equal and combine them when i stitch them together?
    //TODO     or just return same window twice with different itemids?
    const itemIds = requestPayload.items.map(item => item.itemId);
    return combineAllItemWindows(allResponses, itemIds);

/*
    return client.getSmartWindows(body)
        .then(function (result) {
            console.debug('--------------result-------------------');
            console.debug(result);

            if (result.message && result.message === 'success') {
                console.debug('--------------success-------------------');
                console.debug(result.data[0]);
                const itemIds = requestPayload.items.map(item => item.itemId);
                return getTransitTimesResponse(result.data[0], itemIds);
            }

            throw new Error('Smart Window Failed Response', result);
        }, function (error) {
            console.error("---------Smart Window Error-----------", error);
            throw error;
        }).catch(function (err) {
            console.error("---------Smart Window Error catch-----------", err);
            throw err;
        });
 */
}

function combineAllItemWindows(itemResponses, itemIds) {
  console.debug('combining item responses');
  console.debug(JSON.stringify(itemResponses));
  //TODO handle error responses
  //const allTransitTimes = itemResponses.map(response => getTransitTimesResponse(response.data[0]));

  var finalResp = new TransitTimesResponse();
  console.debug('initial final tts');
  console.debug(finalResp.transitTimes);
  itemResponses.forEach((element, index) => {
    const itemTransitTimes = getTransitTimesResponse(element.data[0], itemIds[index]);
    console.debug('adding item tts');
    console.debug(itemTransitTimes);
    finalResp.transitTimes.concat(itemTransitTimes);
    if(finalResp.transitTimes.length === 0){
      finalResp.transitTimes = itemTransitTimes;
    } else {
      finalResp.transitTimes.concat(itemTransitTimes);
    }
  });
  console.debug('finalresp');
  console.debug(JSON.stringify(finalResp));
  return finalResp;

  /*
  allTransitTimes.forEach((element, index) => {
    element.itemIds = [itemIds[index]];
  });
  console.debug('combinedTransitTimes');
  console.debug(JSON.stringify(allTransitTimes));
  const response = new TransitTimesResponse(allTransitTimes);
  console.debug(JSON.stringify(response));
  return response;

   */
}

async function getSmartWindows(client, payloads) {
  const requests = payloads.map(payload => client.getSmartWindows(payload));
  const responses = await Promise.all(requests);

  console.debug('got smartwindow responses!');
  console.debug(responses);

  return responses;

  //const dataPromises = responses.map(response => response.json());
  //return await Promise.all(dataPromises);
}

async function getRates(requestContext, requestPayload) {

    //This application only supports Delivery
    if (requestPayload.items.every(item => item.fulfillmentMethod.toLowerCase() != FULFILLMENT_METHOD_DELIVERY)) {
        //if request doesnt have any Delivery item, return empty list
        return new GetRatesResponse(null, null, []);
    }

    console.debug('--------------requestPayload-------------------');
    console.debug(requestPayload);

    var body = getRatesPayload(requestPayload);

    console.debug('--------------body-------------------');
    console.debug(body);

    var client = getDeliverySolutionsClient(requestContext.credentials);

    return client.getRates(body)
        .then(function (result) {
            console.debug('--------------result-------------------');
            console.debug(result);

            if (!result)
                throw new Error('DS Get Rates Response', result);

            // if (result.errors && result.errors.length > 0) {
            //     console.debug('--------------Error Response-------------------');
            //     console.debug(result.errors);
            //     throw new Error('DS Get Rates Error Response', result.message);
            // }

            const response = getRatesResponse(result);
            console.debug('--------------Carrier Rates-------------------');
            console.debug(response);
            return response;

        }, function (error) {
            console.error("---------DS Get Rates Error-----------", error);
            throw error;
        }).catch(function (err) {
            console.error("---------DS Get Rates Error catch-----------", err);
            throw err;
        });
}

function getDeliverySolutionsClient(credentials) {
    var config = getConfig(credentials);
    return new DeliverySolutionsSdk(config, true);
}

function getConfig(credentials) {
    return {
        tenantId: credentials.find(x => x.key == 'tenantId').value,
        apiKey: credentials.find(x => x.key == 'apiKey').value
    };
}

//DeliverySolutions only takes 1 item per request, so returning array of payloads for each item...
function getSmartWindowPayloads(kiboRequest) {
    var payloads = [];
    kiboRequest.items.forEach((item) => {
      console.debug('Building reqpayload for item...');
      console.debug(item);
      var body = new SmartWindowRequest();
      body.storeExternalIds.push(kiboRequest.originLocationCode);
      body.startDate = kiboRequest.shipDate ? new Date(kiboRequest.shipDate).toISOString().slice(0, 10) : null;  // Format should be YYYY-MM-DD
      body.options.itemList = {
        quantity: item.quantity,
        weight: item.unitMeasurements.weight.value,
        size: {
          height: item.unitMeasurements.height.value, //TODO kibo can be in or ft, DS wants in
          width: item.unitMeasurements.width.value,
          length: item.unitMeasurements.length.value
        }
      };
      payloads.push(body);

    });

    return payloads;
}

function getTransitTimesResponse(smartWindowResponse, itemId) {
  const response = new TransitTimesResponse();

  smartWindowResponse.delivery.forEach(delivery => {

    delivery.windows.forEach(window => {
        var existingTransitTime = response.transitTimes.find(x => x.carrierId === window.provider);
        if (!existingTransitTime) {
            existingTransitTime = CreateCarrierTransitTime(window.provider, itemId);
            response.transitTimes.push(existingTransitTime);
        }

        var existingDeliveryDate = existingTransitTime.estimatedDeliveryDates.find(x => x.deliveryDate === delivery.date);
        if (!existingDeliveryDate) {
            existingDeliveryDate = CreateEstimatedDeliveryDate(delivery.date);
            existingTransitTime.estimatedDeliveryDates.push(existingDeliveryDate);
        }

        var deliveryWindow = new Window(new TimeWindow(window.pickupTime.startsAt, window.pickupTime.endsAt), new TimeWindow(window.dropoffTime.startsAt, window.dropoffTime.endsAt));
        existingDeliveryDate.windows.push(deliveryWindow);
    });
  });
  console.debug('single item tts');
  console.debug(response.transitTimes);
  return response.transitTimes;
}

function CreateCarrierTransitTime(carrierId, itemId) {
    const carrierTransitTime = new CarrierTransitTime();
    carrierTransitTime.carrierId = carrierId;
    carrierTransitTime.itemIds = [itemId];
    return carrierTransitTime;
}

function CreateEstimatedDeliveryDate(deliveryDate) {
    const estimatedDeliveryDate = new EstimatedDeliveryDate();
    estimatedDeliveryDate.fulfillmentMethod = 'Delivery';
    estimatedDeliveryDate.deliveryDate = deliveryDate;
    return estimatedDeliveryDate;
}

function getRatesPayload(requestPayload) {
    var body = new RatesRequest();
    body.deliveryAddress = {
        apartmentNumber: requestPayload.destinationAddress.address1,
        street: requestPayload.destinationAddress.address2,
        street2: requestPayload.destinationAddress.address3,
        city: requestPayload.destinationAddress.cityOrTown,
        state: requestPayload.destinationAddress.stateOrProvince,
        zipcode: requestPayload.destinationAddress.postalOrZipCode,
        country: requestPayload.destinationAddress.countryCode
    };
    body.storeExternalIds.push(requestPayload.originLocationCode);
    body.type = 'delivery';
    body.orderValue = requestPayload.orderTotal;
    body.pickupTime = null;
    body.dropoffTime = null;
    //body.options = '';
    body.items = getRatesItem(requestPayload.items);

    return body;
}

function getRatesItem(items) {
    var dsItems = [];
    items.forEach(item => {
        if (item.fulfillmentMethod.toLowerCase() != FULFILLMENT_METHOD_DELIVERY) {
            return;
        }

        var dsItem = new Item();
        dsItem.sku = item.productSummaries[0].productCode;
        dsItem.upc = item.productSummaries[0].productCode;
        dsItem.quantity = item.quantity;
        dsItem.size = {
            height: item.unitMeasurements.height.value,
            width: item.unitMeasurements.width.value,
            length: item.unitMeasurements.length.value
        };
        dsItem.weight = item.unitMeasurements.weight.value;
        dsItem.price = item.productSummaries[0].price;
        dsItem.sale_price = item.productSummaries[0].price;
        //dsItem.image = item.image;
        //dsItem.title = item.title;
        dsItem.description = item.productSummaries[0].productDescription;
        dsItem.itemAttributes = item.data;
        dsItems.push(dsItem);
    });
    return dsItems;
}

/**
 *
 * @param {RatesResponse} rates
 */
function getRatesResponse(ratesResponse) {
    const response = new GetRatesResponse();

    ratesResponse.rates.forEach(rate => {
        if (!rate || rate.amount === 0) {
            return;
        }

        var exisitngCarrierRate = response.carrierRatesResponses.find(x => x.carrierId === rate.provider);
        if (!exisitngCarrierRate) {
            exisitngCarrierRate = new Rate();
            exisitngCarrierRate.carrierId = rate.provider;
            response.carrierRatesResponses.push(exisitngCarrierRate);
        }

        var shippingRate = new ShippingRate();
        const pickupDate = new Date(rate.estimatedPickupTime);
        shippingRate.code = rate.provider + '_' + rate.serviceType + '_' + pickupDate.getUTCHours();
        shippingRate.content = {};
        shippingRate.amount = getAmount(rate.amount, rate.fee, rate.currency);
        //shippingRate.daysInTransit = rate.estimatedDeliveryTime;
        //shippingRate.shippingItemRates = rate.chargeDetails;
        //shippingRate.customAttributes = rate.tags;
        //shippingRate.messages = rate.ruleApplied;
        //shippingRate.data = rate;
        shippingRate.windows = rate.windows;
        exisitngCarrierRate.shippingRates.push(shippingRate);
    });

    getRatesErrorResponse(ratesResponse, response);
    return response;
}

/**
 *
 * @param {RatesResponse} ratesResponse
 */
function getRatesErrorResponse(ratesResponse, existingResponse) {
    const response = existingResponse || new GetRatesResponse();

    if (!ratesResponse || !ratesResponse.errors || ratesResponse.errors.length === 0) {
        return;
    }

    ratesResponse.errors.forEach(error => {
        var exisitngCarrierRate = response.carrierRatesResponses.find(x => x.carrierId === error.provider);
        if (!exisitngCarrierRate) {
            exisitngCarrierRate = new Rate();
            exisitngCarrierRate.carrierId = error.provider;
            response.carrierRatesResponses.push(exisitngCarrierRate);
        }

        var shippingRate = exisitngCarrierRate.shippingRates.find(x => !x.error && x.errors.length > 0) || new ShippingRate();
        shippingRate.code = error.code;
        shippingRate.messages.push(new ShippingRateValidationMessage(null, error.message, error.severity));
        exisitngCarrierRate.shippingRates.push(shippingRate);
    });

    return response;
}

//If fee field is having greater value than amount, then subtract amount from fee and difference is actual delivery fee.
//for example in the Door-dash delivery response above, amount is 1092 (i.e. 10$ and 90 cents) and fees is 1292 (i.e. 12$ and 90 cents).
//So here delivery fee computed will be 1292-1092 =200 i.e. 2$s
//IF fee field is having smaller value than amount, then use that fields value itself as a deliver fees'
//for example in the Uber delivery response above, amount is 1087 (i.e. 10$ and 82 cents) and fees is 200 (i.e. 2$).
//So here use delivery fee directly (2$) without any computation.
function getAmount(amount, fee, currency) {
    var computedAmount = amount;
    if (fee > amount) {
        computedAmount = fee - amount;
    }
    else if (fee < amount) {
        computedAmount = fee;
    }

    return !currency || (currency && currency.toLowerCase()) === 'cents' ? (computedAmount / 100) : computedAmount;
}
