/**
 * @typedef {Object} RedisRequest
 * @property {string} command
 * @property {string[]} arguments
 */

/**
 * @typedef {'+' | '-' | ':' | '$' | '*'} RespDataTypeFirstByte
 */

/**
 * @typedef {'Simple' | 'Aggregate'} RespDataTypeCategory
 */

/**
 * @typedef {Object} RespDataType
 * @property {RespDataTypeFirstByte} FIRST_BYTE
 * @property {RespDataTypeCategory} CATEGORY
 */

module.exports = {};
