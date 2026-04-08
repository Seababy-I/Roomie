import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`, {
                tokenId: credentialResponse.credential
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Access denied. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center pt-32 pb-20 px-6 min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card-dark rounded-[2.5rem] border border-white/5 p-12 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="text-center space-y-6 mb-12">
                    <div className="w-20 h-20 bg-accent-cyan/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-accent-cyan/20">
                        <ShieldCheck className="w-10 h-10 text-accent-cyan" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">Access Roomie</h1>
                        <p className="text-text-secondary font-medium">Verify your identity with Google.</p>
                    </div>
                </div>

                <div className="space-y-8 flex flex-col items-center">
                    <div className="w-full relative group min-h-[50px] flex justify-center">
                        {loading && (
                            <div className="absolute inset-0 bg-card-dark/80 backdrop-blur-md z-20 flex items-center justify-center rounded-2xl">
                                <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
                            </div>
                        )}

                        <div className="relative z-10 w-full flex justify-center transition-transform group-hover:scale-[1.02] duration-300">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Login Failed')}
                                useOneTap
                                theme="filled_black"
                                shape="pill"
                                width="320px"
                                text="continue_with"
                            />
                        </div>
                    </div>

                    <div className="text-center space-y-3 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-center gap-2 text-accent-cyan mb-1">
                            <div className="h-1 w-8 bg-accent-cyan/30 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure Login</span>
                            <div className="h-1 w-8 bg-accent-cyan/30 rounded-full" />
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                            Roomie uses Google for a safe and frictionless sign-in experience.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20 text-sm font-bold"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                        </motion.div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">Secured via Google Identity</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
