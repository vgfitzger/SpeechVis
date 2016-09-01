"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Noop function (do nothing)
 */
var noop = exports.noop = function noop() {};

/**
 * Excute callback if value is not undefined
 * @param  {any} value [value to check]
 * @param  {Function} callback [function to be excuted]
 */
var runIfSet = exports.runIfSet = function runIfSet(value, callback) {
  if (value !== undefined) {
    callback;
  }
};