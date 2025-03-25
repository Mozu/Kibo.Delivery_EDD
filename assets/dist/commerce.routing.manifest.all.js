(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  "http.commerce.routing.suggestion.before": {
    actionName: "http.commerce.routing.suggestion.before",
    customFunction: require("./domains/commerce.routing/http.commerce.routing.suggestion.before"),
  },

  "http.commerce.routing.suggestion.after": {
    actionName: "http.commerce.routing.suggestion.after",
    customFunction: require("./domains/commerce.routing/http.commerce.routing.suggestion.after"),
  },
};

},{"./domains/commerce.routing/http.commerce.routing.suggestion.after":2,"./domains/commerce.routing/http.commerce.routing.suggestion.before":3}],2:[function(require,module,exports){
/**


 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.

{
  configuration: {},
  request: http.ClientRequest,
  response: http.ClientResponse
}

 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.

 */

module.exports = function (context, callback) {
  console.log('http.commerce.routing.suggestion.after', context.response.body);

  var scenario1 = {
    assignmentSuggestions: {
      '1': [
        {
          "orderItemID": 1,
          "locationCode": "USWH1",
          "quantity": 1,
          "route": "DIRECTSHIP",
          "futureDate": null,
          "shipmentGroup": null,
          "data": {
            "suggestionItem1": ["SuggestionItemData1"]
          }
        }
      ],
      '2':[
        {
          "orderItemID": 2,
          "locationCode": "USWH1",
          "quantity": 2,
          "route": "DIRECTSHIP",
          "futureDate": null,
          "shipmentGroup": "group1",
          "data": {
            "suggestionItem1": ["SuggestionItem2Group1"]
          }
        },
        {
          "orderItemID": 2,
          "locationCode": "USS1",
          "quantity": 1,
          "route": "TRANSFER",
          "futureDate": null,
          "shipmentGroup": "group1",
          "data": {
            "suggestionItem1": ["SuggestionItem2TransferGroup1"]
          }
        }
      ]
    },
    assignmentSuggestionShipmentGroups: [
      {
        "locationID": 1,
        "id": "group1",
        "locationCode": "USWH1",
        "data": {
          "suggestionGroup1": ["SuggestionGroupData1"]
        }
      }
    ],
    availableLocations: [],
    emptyResponse: false,
    futureAssignmentSuggestions: {},
    route: "STH_CONSOLIDATED",
    stateChangeSuggestions: { },
    data: {
      "rootSuggestion1": ["RootSuggestionData1"]
    },
    attributes: [{
      "attributeFQN": "tenant~test3",
      "attributeValues": [123456]
    }]
  };

  if (context.response.body) {
    context.response.body = scenario1;
  }

  console.log('http.commerce.routing.suggestion.after Modified', context.response.body);
  callback();
};
},{}],3:[function(require,module,exports){
/**

 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.

{
  configuration: {},
  request: http.ClientRequest,
  response: http.ClientResponse
}

 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.

 */

module.exports = function(context, callback) {
  
  console.log('http.commerce.routing.suggestion.before',  context.request.body);
  if (context.request.body){
    context.request.body.cartID = "heydad";
  }
  
  console.log('http.commerce.routing.suggestion.before2',  context.request.body);
  callback();
};
},{}]},{},[1])(1)
});
