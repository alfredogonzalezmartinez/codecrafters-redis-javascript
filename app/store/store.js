const store = new Map();

/**
 * @typedef {Object} SetOptions
 * @property {number} expiry
 */

const SET_DEFAULT_OPTIONS = Object.freeze({
  expiry: null,
});

/**
 * @param {string} key
 * @param {string} value
 * @param {SetOptions} options
 */
function set(key, value, { expiry } = SET_DEFAULT_OPTIONS) {
  if (expiry) expiry = new Date().getTime() + expiry;

  store.set(key, { value, expiry });
}

/**
 * @param {string} key
 * @returns {string | undefined}
 */
function get(key) {
  const result = store.get(key);
  if (!result) return;
  const { value, expiry } = result;

  if (expiry) {
    const now = new Date().getTime();
    const isExpired = now > expiry;
    if (isExpired) {
      store.delete(key);
      return;
    }
  }

  return value;
}

module.exports = { set, get };
