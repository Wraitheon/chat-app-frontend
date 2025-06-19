'use client';

import { useState } from 'react';
import Input from '../../ui/Input/Input';
import styles from './LoginForm.module.scss';
import Link from 'next/link';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation
    let newErrors = { email: '', password: '' };
    if (!formData.email.includes('@')) { // A very basic email check
      newErrors.email = 'Please enter a valid work email.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Please enter correct password.';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log('Logging in with:', formData);
      alert('Login successful! (Check console for data)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        name="email"
        type="email"
        placeholder="Email Address / Phone Number"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
      />

      <div className={styles.passwordWrapper}>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
        />
        <Link href="#" className={styles.forgotPassword}>
          Forgot password
        </Link>
      </div>

      <button type="submit" className={styles.submitButton}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;