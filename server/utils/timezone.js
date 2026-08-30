"use strict";

/**
 * Checks whether a string is an IANA time zone name that this runtime knows,
 * e.g. "Asia/Taipei". Used to validate the `timezone` fields on User and
 * QuestCompletion so that an unusable zone cannot reach the database.
 *
 * @param {string} zone - The candidate IANA time zone name
 * @returns {boolean} - true if the zone is valid
 */
function isValidTimeZone(zone) {
  if (typeof zone !== "string" || zone.length === 0) return false;
  try {
    // Intl throws a RangeError for a zone it does not recognise.
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

// Reusable Mongoose validator for an IANA time zone field.
const timeZoneValidator = {
  validator: isValidTimeZone,
  message: (props) => `${props.value} is not a valid IANA time zone`,
};

module.exports = {
  isValidTimeZone,
  timeZoneValidator,
};
