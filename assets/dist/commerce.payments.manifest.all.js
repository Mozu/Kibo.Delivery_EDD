(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  
  'embedded.commerce.payments.action.before': {
      actionName: 'embedded.commerce.payments.action.before',
      customFunction: require('./domains/commerce.payments/embedded.commerce.payments.action.before')
  },
  
  'embedded.commerce.payments.action.after': {
      actionName: 'embedded.commerce.payments.action.after',
      customFunction: require('./domains/commerce.payments/embedded.commerce.payments.action.after')
  }
};

},{"./domains/commerce.payments/embedded.commerce.payments.action.after":2,"./domains/commerce.payments/embedded.commerce.payments.action.before":3}],2:[function(require,module,exports){
module.exports = function (context, callback) {
  try {
    console.log("payment after");
  }
  catch(exception){
    console.info(exception);
  }
  context.response.end();
  callback();
};

},{}],3:[function(require,module,exports){
/*
 * Implementation for embedded.commerce.payments.action.before
*/

var https = require('https');

module.exports = function(context, callback) {
    try {
        var order = context.get.order();
        var payment = context.get.payment();
        var action = context.get.paymentAction();
        //console.log(`${payment.paymentType} - Payment Action After - Order - ${order.orderNumber} - Type - ${order.type} - Action - ${action.actionName} - Amount - ${action.amount}`);
        console.log('Payment for Order' + order.orderNumber);
        console.log(JSON.stringify(payment));
        
        context.exec.setActionAmount(3.33);
      } catch (err) {
        console.error(err);
      } finally {
        callback();
      }
};
},{"https":undefined}]},{},[1])(1)
});
