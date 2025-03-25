const { SmartWindowRequest } = require('../../deliverysolutions/models/SmartWindowRequest');
const { Data } = require('../../deliverysolutions/models/SmartWindowResponse');
const { TransitTimesResponse, CarrierTransitTime, EstimatedDeliveryDate, Window } = require('../../models/TransitTimesResponse');
const { DeliverySolutionsSdk } = require('../../deliverysolutions/deliverysolutionssdk');
const { FULFILLMENT_METHOD_DELIVERY } = require('../../constants');

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
}

async function getTransitTimes(requestContext, requestPayload) {

    //This application only suppors Delivery
    if (requestPayload.fulfillmentMethod.toLowerCase() != FULFILLMENT_METHOD_DELIVERY) {
        //if request doesnt want Delivery, return empty list
        return new TransitTimesResponse([]);
    }

    console.debug('--------------requestPayload-------------------');
    console.debug(requestPayload);

    var body = getSmartWindowPayload(requestPayload);

    console.debug('--------------body-------------------');
    console.debug(body);

    var client = getDeliverySolutionsClient(requestContext.credentials);

    return client.getSmartWindows(body)
        .then(function (result) {
            console.debug('--------------result-------------------');
            console.debug(result);

            if (result.message && result.message === 'success') {
                console.debug('--------------success-------------------');
                console.debug(result.data[0]);
                return getTransitTimesResponse(result.data[0]);
            }

            throw new Error('Smart Window Failed Response', result);
        }, function (error) {
            console.error("---------Smart Window Error-----------", error);
            throw error;
        }).catch(function (err) {
            console.error("---------Smart Window Error catch-----------", err);
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

function getSmartWindowPayload(requestPayload) {
    var body = new SmartWindowRequest();
    body.storeExternalIds.push(requestPayload.originLocationCode);
    body.startDate = requestPayload.shipDate ? new Date(requestPayload.shipDate).toISOString().slice(0, 10) : null;  // Format should be YYYY-MM-DD
    body.options.itemList = {
        quantity: requestPayload.item.quantity,
        weight: requestPayload.item.unitMeasurements.weight.value,
        size: {
            height: requestPayload.item.unitMeasurements.height.value,
            width: requestPayload.item.unitMeasurements.width.value,
            length: requestPayload.item.unitMeasurements.length.value
        }
    };
    return body;
}

/**
 * 
 * @param {Data} transitTimes 
 */
function getTransitTimesResponse(transitTimes) {
    const response = new TransitTimesResponse();

    transitTimes.delivery.forEach(delivery => {

        delivery.windows.forEach(window => {
            var existingTransitTime = response.transitTimes.find(x => x.carrierId === window.provider);
            if (!existingTransitTime) {
                existingTransitTime = CreateCarrierTransitTime(window.provider);
                response.transitTimes.push(existingTransitTime);
            }

            var existingDeliveryDate = existingTransitTime.estimatedDeliveryDates.find(x => x.deliveryDate === delivery.date && x.timeZone === window.tz);
            if (!existingDeliveryDate) {
                existingDeliveryDate = CreateEstimatedDeliveryDate(delivery.date, window.tz);
                existingTransitTime.estimatedDeliveryDates.push(existingDeliveryDate);
            }

            var deliveryWindow = new Window();
            deliveryWindow.pickupTime = window.pickupTime;
            deliveryWindow.dropoffTime = window.dropoffTime;
            existingDeliveryDate.windows.push(deliveryWindow);
        });
    });
    return response;
}

function CreateCarrierTransitTime(carrierId) {
    const carrierTransitTime = new CarrierTransitTime();
    carrierTransitTime.carrierId = carrierId;

    return carrierTransitTime;
}

function CreateEstimatedDeliveryDate(deliveryDate, timeZone) {
    const estimatedDeliveryDate = new EstimatedDeliveryDate();
    estimatedDeliveryDate.fulfillmentMethod = 'Delivery';
    estimatedDeliveryDate.deliveryDate = deliveryDate;
    estimatedDeliveryDate.timeZone = timeZone;
    return estimatedDeliveryDate;
}