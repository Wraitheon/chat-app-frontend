'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../../ui/Input/Input';
import styles from './SignupForm.module.scss';
import { useRegister } from './hooks/useRegister';

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  console.log(`Checking username: ${username}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(username !== 'msalman.qlu');
    }, 500);
  });
};

const checkPasswordStrength = (password: string) => {
  if (!password) return { strength: '', color: '', score: 0 };
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  if (checks.length) score++;
  if (checks.lowercase) score++;
  if (checks.uppercase) score++;
  if (checks.numbers) score++;
  if (checks.special) score++;

  if (score < 3) return { strength: 'Weak', color: '#ff4444', score };
  if (score < 4) return { strength: 'Medium', color: '#ffaa00', score };
  return { strength: 'Strong', color: '#00aa44', score };
};


const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    username: '',
    password: '',
  });

  const [usernameError, setUsernameError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: '', color: '', score: 0 });

  const { mutate: performRegister, isPending, error } = useRegister();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'username') {
      setUsernameError('');
    }

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleUsernameBlur = async () => {
    if (formData.username.length < 3) return;
    const isAvailable = await checkUsernameAvailability(formData.username);
    if (!isAvailable) {
      setUsernameError('Username unavailable. Try using numbers, underscores etc.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!formData.displayName.trim()) {
      toast.error('Display name is required.');
      return;
    }
    if (!formData.username.trim() || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return;
    }
    if (usernameError) {
      toast.error('That username is not available.');
      return;
    }
    if (passwordStrength.score < 3) {
      toast.error('Please choose a stronger password.');
      return;
    }

    performRegister(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleInputChange}
      />
      <Input
        name="displayName"
        type="text"
        placeholder="Display Name"
        value={formData.displayName}
        onChange={handleInputChange}
        helperText="This is how other people see you. You can use special characters & emojis"
      />
      <Input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
        onBlur={handleUsernameBlur}
        error={usernameError}
        helperText={!usernameError ? "Please only use numbers, letters, underscores or periods." : ""}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        helperText={passwordStrength.strength ? `Password strength: ${passwordStrength.strength}` : ""}
        helperTextColor={passwordStrength.color}
        showPasswordStrengthIcon={passwordStrength.score >= 3}
      />

      {error && <p className={styles.apiError}>{error.message}</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Creating Account...' : 'Signup'}
      </button>
    </form>
  );
};

export default SignupForm;