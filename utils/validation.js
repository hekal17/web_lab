const isNonEmptyString = (value) => {
    return typeof value === "string" && value.trim() !== "";
};

const isValidEmail = (email) => {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isStrongPassword = (password) => {
    return typeof password === "string" && password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

const trimText = (value) => {
    if (typeof value === "string") {
        return value.trim();
    }
    return value;
};

const isValidId = (id) => {
    return /^[1-9][0-9]*$/.test(String(id));
};

const isPositiveNumber = (value) => {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
};

const isValidRating = (value) => {
    return Number.isInteger(value) && value >= 1 && value <= 5;
};

module.exports = {
    isNonEmptyString,
    isValidEmail,
    isStrongPassword,
    trimText,
    isValidId,
    isPositiveNumber,
    isValidRating
}