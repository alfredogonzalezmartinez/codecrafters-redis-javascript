const PROTOCOLS_TERMINATOR = "\r\n";

const NIL = "$-1\r\n";

const RESP_DATA_TYPE_CATEGORY = Object.freeze({
  SIMPLE: "Simple",
  AGGREGATE: "Aggregate",
});

const RESP_DATA_TYPE = Object.freeze({
  SIMPLE_STRING: Object.freeze({
    FIRST_BYTE: "+",
    CATEGORY: RESP_DATA_TYPE_CATEGORY.SIMPLE,
  }),
  SIMPLE_ERROR: Object.freeze({
    FIRST_BYTE: "-",
    CATEGORY: RESP_DATA_TYPE_CATEGORY.SIMPLE,
  }),
  INTEGER: Object.freeze({
    FIRST_BYTE: ":",
    CATEGORY: RESP_DATA_TYPE_CATEGORY.SIMPLE,
  }),
  BULK_STRING: Object.freeze({
    FIRST_BYTE: "$",
    CATEGORY: RESP_DATA_TYPE_CATEGORY.AGGREGATE,
  }),
  ARRAY: Object.freeze({
    FIRST_BYTE: "*",
    CATEGORY: RESP_DATA_TYPE_CATEGORY.AGGREGATE,
  }),
});

const EXPIRY_OPTION = Object.freeze({
  EX: Object.freeze({ option: "EX", millisecondsMultiplier: 1000 }),
  PX: Object.freeze({ option: "PX", millisecondsMultiplier: 1 }),
});

module.exports = {
  PROTOCOLS_TERMINATOR,
  NIL,
  RESP_DATA_TYPE_CATEGORY,
  RESP_DATA_TYPE,
  EXPIRY_OPTION,
};
