import DOMPurify from 'dompurify';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{12,}$/;


export const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
};

export const validateEmail = (email) => {
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return passwordRegex.test(password);
};

// Funktion för att validera lösenordet mot kraven i register
export const validatePasswordChecks = (password, setPasswordValidations) => {
    setPasswordValidations({
        length: password.length >= 12,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[\W_]/.test(password),
    });
};
