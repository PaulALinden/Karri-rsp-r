import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
    return (
        <div>
            <h1>404 - Sidan hittades inte</h1>
            <p>Tyvärr kunde den sida du letade efter inte hittas.</p>
            <Link to="/">Gå tillbaka</Link>
        </div>
    );
};

export default NotFoundPage;
