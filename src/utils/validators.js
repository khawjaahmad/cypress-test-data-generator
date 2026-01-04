/**
 * Validate that a value is a positive integer
 * @param {number} value - Value to check
 * @param {string} name - Parameter name for error message
 * @throws {Error} If value is not a positive integer
 */
const validatePositiveInteger = (value, name) => {
    if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
        throw new Error(`${name} must be a positive integer`);
    }
};

/**
 * Validate age range parameters
 * @param {number} min - Minimum age
 * @param {number} max - Maximum age
 * @throws {Error} If age range is invalid
 */
const validateAgeRange = (min, max) => {
    if (min > max) {
        throw new Error(`Max ${max} should be greater than min ${min}.`);
    }
    if (min < 0 || max < 0) {
        throw new Error('Age cannot be negative');
    }
    if (max > 150) {
        throw new Error('Age cannot exceed 150');
    }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate that a value is a non-negative number
 * @param {number} value - Value to check
 * @param {string} name - Parameter name for error message
 * @throws {Error} If value is negative
 */
const validateNonNegative = (value, name) => {
    if (typeof value !== 'number' || value < 0) {
        throw new Error(`${name} must be a non-negative number`);
    }
};

/**
 * Validate that a string is not empty
 * @param {string} value - Value to check
 * @param {string} name - Parameter name for error message
 * @throws {Error} If string is empty
 */
const validateNonEmptyString = (value, name) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`${name} must be a non-empty string`);
    }
};

/**
 * Validate that a value is within a range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} name - Parameter name for error message
 * @throws {Error} If value is out of range
 */
const validateRange = (value, min, max, name) => {
    if (typeof value !== 'number' || value < min || value > max) {
        throw new Error(`${name} must be between ${min} and ${max}`);
    }
};

module.exports = {
    validatePositiveInteger,
    validateAgeRange,
    isValidEmail,
    validateNonNegative,
    validateNonEmptyString,
    validateRange
};
