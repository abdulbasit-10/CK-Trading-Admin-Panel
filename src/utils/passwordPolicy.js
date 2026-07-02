/**
 * Client-side password policy — mirrors the backend rules exactly so
 * users get immediate feedback instead of round-tripping to the server.
 *
 * Rules:
 *  - At least 8 characters
 *  - At most 128 characters
 *  - At least one lowercase letter
 *  - At least one uppercase letter
 *  - At least one digit
 *
 * @param {string} password
 * @returns {string|null}  Error message, or null if the password is valid.
 */
export const validatePassword = (password) => {
  if (typeof password !== "string" || password.length === 0)
    return "Password is required";
  if (password.length < 8)
    return "Password must be at least 8 characters long";
  if (password.length > 128)
    return "Password is too long";
  if (!/[a-z]/.test(password))
    return "Password must contain a lowercase letter";
  if (!/[A-Z]/.test(password))
    return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain a digit";
  return null;
};

/**
 * Helper: returns a human-readable hint string shown below password fields.
 */
export const PASSWORD_HINT =
  "Min 8 characters · uppercase · lowercase · digit";
