export default function handleFirebaseAuthError(error) {
    const errorMap = {
        'auth/invalid-email': 'E-postadressen är inte giltig.',
        'auth/email-already-exists': 'E-postadressen är redan registrerad.',
        'auth/user-not-found': 'Användaren kunde inte hittas.',
        'auth/invalid-password': 'Lösenordet är ogiltigt eller för kort.',
        'auth/uid-already-exists': 'UID är redan kopplat till en användare.',
        'auth/operation-not-allowed': 'Operationen är inte tillåten.',
        'auth/weak-password': 'Lösenordet är för svagt. Vänligen använd ett starkare lösenord.',
        'auth/phone-number-already-exists': 'Telefonnumret är redan kopplat till en annan användare.',
        'auth/invalid-phone-number': 'Telefonnumret är inte giltigt.',
        'auth/invalid-uid': 'UID är inte giltigt. UID måste vara högst 128 tecken långt.',
        'auth/too-many-requests': 'För många misslyckade försök. Vänligen försök igen senare.',
        'auth/insufficient-permission': 'Administratören har inte tillräckliga rättigheter för att utföra denna åtgärd.',
        'auth/internal-error': 'Ett internt serverfel uppstod. Försök igen senare.',
        'auth/invalid-credential': 'Autentiseringsuppgifterna är ogiltiga eller har gått ut. Vänligen försök logga in igen.',
        'auth/credential-already-in-use': 'Autentiseringsuppgifterna är redan kopplade till ett annat konto.',
        'auth/invalid-verification-code': 'Verifieringskoden är ogiltig eller har gått ut.',
        'auth/missing-verification-code': 'Verifieringskoden saknas. Vänligen ange en giltig kod.',
        'auth/account-exists-with-different-credential': 'Ett konto med samma e-postadress finns redan, men med andra autentiseringsuppgifter.',
        'auth/session-cookie-expired': 'Sessionens cookie har gått ut. Logga in igen.',
        'auth/session-cookie-revoked': 'Sessionens cookie har återkallats. Logga in igen.',

        'auth/email-verification': 'Please verify your email.'
    };

    if (errorMap[error.code]) {
        return errorMap[error.code];
    }

    return 'Ett oväntat fel uppstod. Försök igen senare.';
};


