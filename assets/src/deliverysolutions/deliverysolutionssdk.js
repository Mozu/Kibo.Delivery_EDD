//var _ = require("underscore");
const { ApiService } = require('../utils/apiService');
const { SmartWindowRequest } = require('./models/SmartWindowRequest');
const { SmartWindowResponse } = require('./models/SmartWindowResponse');
const { api_url_sandbox, api_url_prod, smart_window_prefix, rates_prefix } = require('./constants');

function DeliverySolutions(config, sandbox = false) {
    const headers = getHeaders(config.tenantId, config.apiKey);
    this.apiWrapper = new ApiService(headers);

    const baseUrl = sandbox ? api_url_sandbox : api_url_prod;

    this.smartWindowsUrl = baseUrl + smart_window_prefix;
    this.ratesUrl = baseUrl + rates_prefix;
}

/**
 * 
 * @param {SmartWindowRequest} body
 * @returns {Promise<SmartWindowResponse>}
 */

DeliverySolutions.prototype.getSmartWindows = async function (body) {
    try {
        const res = await this.apiWrapper.post(this.smartWindowsUrl, body);
        return res;
    }
    catch (e) {
        console.log('Error in getSmartWindows:', e);
        throw e;
    }
};

DeliverySolutions.prototype.getRates = async function (body) {
    try {
        const res = await this.apiWrapper.post(this.ratesUrl, body);
        return res;
    }
    catch (e) {
        console.log('Error in getRates:', e);
        throw e;
    }
};

const getHeaders = function (tenantId, apiKey, contentType = 'application/json') {
    return {
        'Content-Type': contentType,
        'tenantId': tenantId,
        'x-api-key': apiKey
    };
};

exports.DeliverySolutionsSdk = DeliverySolutions;