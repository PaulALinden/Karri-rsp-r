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
    console.log("inkorrekt lösen " + password)
    return passwordRegex.test(password);
};

