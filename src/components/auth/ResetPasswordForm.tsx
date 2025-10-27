import React, { useState } from 'react';
import Button from '../ui/Button';
import { BACKEND_ORIGIN,AES_SECRET } from '../../features/auth/common/constants';
import { encryptPayload } from "../../utils/jwt";


const ResetPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        // Replace '/api/reset-password' with your backend endpoint
        fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to send reset link');
                }
                return res.json();
            })
            .then(() => {
                setMessage('Password reset link sent to your email.');
                setEmail('');
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-2 border border-gray-300 rounded"
                required
            />
            <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
