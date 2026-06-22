export { validateFullName, getNameErrorMessage } from '../utils/nameValidation.js';
export { validateEmailFormat, getEmailErrorMessage, normalizeEmail } from '../utils/emailValidation.js';
export { validateBrazilianPhone, getPhoneErrorMessage, extractPhoneDigits } from '../utils/phoneValidation.js';
export { validateCPFChecksum, getCPFErrorMessage } from '../utils/cpfValidation.js';
export { validateCNPJChecksum, getCNPJErrorMessage } from '../utils/cnpjValidation.js';
export { validatePasswordStrength, getPasswordErrorMessage, getPasswordValidationDetails } from '../utils/passwordValidation.js';
export { validateMunicipalityName, getMunicipalityErrorMessage } from '../utils/municipalityValidation.js';
export { isValidStateCode, getBrazilianStates } from '../utils/brazilianStates.js';
export { formatTelefone, formatCPF, formatCNPJ } from '../utils/formatters.js';

export const validateName = validateFullName;
export const validateEmail = validateEmailFormat;
export const validateTelefone = validateBrazilianPhone;
export const validateCPF = validateCPFChecksum;
export const validateCNPJ = validateCNPJChecksum;
export const validatePassword = validatePasswordStrength;
export const validateMunicipality = validateMunicipalityName;
export const validateState = isValidStateCode;
