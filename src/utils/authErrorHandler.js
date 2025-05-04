import { useLanguage } from '../components/context/LanguageContext'; // Importera useLanguage från din kontextfil

export default function handleFirebaseAuthError(error, language = 'en') {
    const errorMap = {
        'auth/invalid-email': {
            sv: 'E-postadressen är inte giltig.',
            en: 'The email address is invalid.'
        },
        'auth/email-already-exists': {
            sv: 'E-postadressen är redan registrerad.',
            en: 'The email address is already registered.'
        },
        'auth/user-not-found': {
            sv: 'Användaren kunde inte hittas.',
            en: 'The user could not be found.'
        },
        'auth/invalid-password': {
            sv: 'Lösenordet är ogiltigt eller för kort.',
            en: 'The password is invalid or too short.'
        },
        'auth/uid-already-exists': {
            sv: 'UID är redan kopplat till en användare.',
            en: 'The UID is already linked to a user.'
        },
        'auth/operation-not-allowed': {
            sv: 'Operationen är inte tillåten.',
            en: 'The operation is not allowed.'
        },
        'auth/weak-password': {
            sv: 'Lösenordet är för svagt. Vänligen använd ett starkare lösenord.',
            en: 'The password is too weak. Please use a stronger password.'
        },
        'auth/phone-number-already-exists': {
            sv: 'Telefonnumret är redan kopplat till en annan användare.',
            en: 'The phone number is already linked to another user.'
        },
        'auth/invalid-phone-number': {
            sv: 'Telefonnumret är inte giltigt.',
            en: 'The phone number is invalid.'
        },
        'auth/invalid-uid': {
            sv: 'UID är inte giltigt. UID måste vara högst 128 tecken långt.',
            en: 'The UID is invalid. UID must be at most 128 characters long.'
        },
        'auth/too-many-requests': {
            sv: 'För många misslyckade försök. Vänligen försök igen senare.',
            en: 'Too many failed attempts. Please try again later.'
        },
        'auth/insufficient-permission': {
            sv: 'Administratören har inte tillräckliga rättigheter för att utföra denna åtgärd.',
            en: 'The administrator does not have sufficient permissions to perform this action.'
        },
        'auth/internal-error': {
            sv: 'Ett internt serverfel uppstod. Försök igen senare.',
            en: 'An internal server error occurred. Please try again later.'
        },
        'auth/invalid-credential': {
            sv: 'Autentiseringsuppgifterna är ogiltiga eller har gått ut. Vänligen försök logga in igen.',
            en: 'The credentials are invalid or have expired. Please try logging in again.'
        },
        'auth/credential-already-in-use': {
            sv: 'Autentiseringsuppgifterna är redan kopplade till ett annat konto.',
            en: 'The credentials are already linked to another account.'
        },
        'auth/invalid-verification-code': {
            sv: 'Verifieringskoden är ogiltig eller har gått ut.',
            en: 'The verification code is invalid or has expired.'
        },
        'auth/missing-verification-code': {
            sv: 'Verifieringskoden saknas. Vänligen ange en giltig kod.',
            en: 'The verification code is missing. Please provide a valid code.'
        },
        'auth/account-exists-with-different-credential': {
            sv: 'Ett konto med samma e-postadress finns redan, men med andra autentiseringsuppgifter.',
            en: 'An account with the same email address already exists, but with different credentials.'
        },
        'auth/session-cookie-expired': {
            sv: 'Sessionens cookie har gått ut. Logga in igen.',
            en: 'The session cookie has expired. Please log in again.'
        },
        'auth/session-cookie-revoked': {
            sv: 'Sessionens cookie har återkallats. Logga in igen.',
            en: 'The session cookie has been revoked. Please log in again.'
        },
        'auth/email-verification': {
            sv: 'Vänligen verifiera din e-postadress.',
            en: 'Please verify your email address.'
        },
        'auth/email-already-in-use': {
            sv: 'E-postadressen är redan i användning.',
            en: 'The email address is already in use.'
        }
    };

    // Returnera felmeddelande baserat på språk, fallback till engelska om språket inte stöds
    if (errorMap[error.code]) {
        return errorMap[error.code][language] || errorMap[error.code].en;
    }

    // Standardfelmeddelande för oväntade fel
    return language === 'sv'
        ? 'Ett oväntat fel uppstod. Försök igen senare.'
        : 'An unexpected error occurred. Please try again later.';
}

