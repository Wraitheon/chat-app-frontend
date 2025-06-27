'use client';

import { useState } from 'react';
import Input from '../../ui/Input/Input';
import styles from './LoginForm.module.scss';
import Link from 'next/link';
import { useLogin } from './hooks/useLogin';
import { LoginCredentials, LoginErrors } from '@/types/auth.types';

const LoginForm = () => {

  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({
    identifier: '',
    password: '',
  });

  const { mutate: performLogin, isPending, error } = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier.trim()) {
      setErrors(prev => ({ ...prev, identifier: 'Email or username is required' }));
      return;
    }

    if (!formData.password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    const credentialsForApi = {
      identifier: formData.identifier,
      password: formData.password,
    };

    performLogin(credentialsForApi);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        name="identifier"
        type="text"
        placeholder="Email Address / Username"
        value={formData.identifier}
        onChange={handleInputChange}
        error={errors.identifier}
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

      {error && <p className={styles.apiError}>{error.message}</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;