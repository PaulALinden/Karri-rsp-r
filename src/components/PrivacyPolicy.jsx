const PrivacyPolicy = (() => {

    return (
        <div>
            <h1>Privacy Policy</h1>
            <p><strong>Effective Date:</strong> 2025-01-25</p>

            <p><strong>Karriärspår</strong> we, value your privacy. This Privacy Policy explains how we collect, use, and protect the personal information you provide when using our website and services.</p>

            <h2>Information We Collect</h2>
            <p>We collect the following types of information from you:</p>
            <ul>
                <li><strong>Account Information:</strong> When you register an account, we collect your email address and password through Firebase Authentication.</li>
                <li><strong>User-Generated Data:</strong> The job application logs and other data you choose to input and save within our service.</li>
            </ul>
            <p>We do not use tracking tools such as Google Analytics or other similar services.</p>

            <h2>How We Use Your Data</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Enable account creation and login functionality.</li>
                <li>Store and display your job application data for your personal use.</li>
                <li>Provide simple statistics about your job applications, such as the number of applications and their statuses.</li>
            </ul>

            <h2>Data Storage and Security</h2>
            <p>All user data is stored securely in Firebase Firestore. While Firebase provides robust security measures, we do not apply any additional encryption or security mechanisms beyond Firebase’s default setup.</p>

            <h2>User Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Request access to the data we store about you.</li>
                <li>Request that we delete your account and all associated data.</li>
            </ul>
            <p>To exercise these rights, please contact us at <strong>[Your Email Address]</strong>.</p>

            <h2>Third-Party Services</h2>
            <p>We rely on Firebase services to manage authentication and data storage. Firebase may collect certain data as described in their Privacy Policy.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at <strong>[Your Email Address]</strong>.</p>
        </div>
    );
});

export default PrivacyPolicy;