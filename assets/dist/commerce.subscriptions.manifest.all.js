(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  
  'http.commerce.subscriptions.reasons.before': {
      actionName: 'http.commerce.subscriptions.reasons.before',
      customFunction: require('./domains/commerce.subscriptions/http.commerce.subscriptions.reasons.before')
  },
  
  'http.commerce.subscriptions.reasons.after': {
      actionName: 'http.commerce.subscriptions.reasons.after',
      customFunction: require('./domains/commerce.subscriptions/http.commerce.subscriptions.reasons.after')
  }
};

},{"./domains/commerce.subscriptions/http.commerce.subscriptions.reasons.after":2,"./domains/commerce.subscriptions/http.commerce.subscriptions.reasons.before":3}],2:[function(require,module,exports){
module.exports = function (context, callback) {
  var response = context.response.body;
  
  try {
    response.items = [];
    var arcReasons = getCancallationReasons();
    response.items = arcReasons;
    response.totalCount = response.items.length;
  }
  catch(exception){
    console.info(exception);
  }
  
  console.info(response);
  context.response.body = response;
  context.response.end();
  callback();
};

function getCancallationReasons(){
  var cancallationReasons = [
    {
      "reasonCode": "ArrivedTooLate",
      "name": "Arrived too late",
      "needsMoreInfo": false,
      "categories": ["CANCEL"]
    },
    {
      "reasonCode": "CustomerChangedMind",
      "name": "Customer changed mind",
      "needsMoreInfo": false,
      "categories": ["CANCEL"]
    },
    {
      "reasonCode": "DamagedOrDefective",
      "name": "Damaged or defective",
      "needsMoreInfo": false,
      "categories": ["CANCEL"]
    },
    {
      "reasonCode": "DidNotMatchWebsite",
      "name": "Did not match website",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "FoundBetterPrice",
      "name": "Found better price",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "NoInventory",
      "name": "No Inventory",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "NotWhatWasOrdered",
      "name": "Not what was ordered",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "OrderedWrongSize",
      "name": "Ordered wrong size",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "Other",
      "name": "Other",
      "needsMoreInfo": true,
      "categories": []
    },
    {
      "reasonCode": "PriceChange",
      "name": "Price change",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "ProductRanSmallOrLarge",
      "name": "Product ran small or large",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "PromotionCorrection",
      "name": "Promotion correction",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "QualityIssue",
      "name": "Quality issue",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "ShippingAppeasement",
      "name": "Shipping appeasement",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "ShippingTaxAppeasement",
      "name": "Shipping Tax appeasement",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "TaxAppeasement",
      "name": "Tax appeasement",
      "needsMoreInfo": false,
      "categories": []
    },
    {
      "reasonCode": "WrongAmountCharged",
      "name": "Wrong amount charged",
      "needsMoreInfo": false,
      "categories": []
    }
  ];

  return cancallationReasons;
}
},{}],3:[function(require,module,exports){
/*
 * Implementation for http.commerce.orders.cancellationReasons.before
*/

var https = require('https');

module.exports = function(context, callback) {
    var url = context.apiContext.baseUrl;
    console.info("Url: " + url);
    context.response.end();     
    callback();
};
},{"https":undefined}]},{},[1])(1)
});
