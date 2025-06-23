'use client';

import { useState } from 'react';
import Input from '../../ui/Input/Input';
import styles from './SignupForm.module.scss';
import { useRegister } from './hooks/useRegister';
import { useAuth } from '@/app/components/providers/AuthProvider';

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

  // Calculate score
  if (checks.length) score++;
  if (checks.lowercase) score++;
  if (checks.uppercase) score++;
  if (checks.numbers) score++;
  if (checks.special) score++;

  // Determine strength and color
  if (score < 3) {
    return { strength: 'Weak', color: '#ff4444', score };
  } else if (score < 4) {
    return { strength: 'Medium', color: '#ffaa00', score };
  } else {
    return { strength: 'Strong', color: '#00aa44', score };
  }
};

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    username: '',
    password: '',
  });

  // State for validation feedback
  const [usernameError, setUsernameError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: '', color: '', score: 0 });
  const { mutate: performRegister, isPending, error } = useRegister();
  const { setUser } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset username error on change
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

    // Basic validation
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }

    if (!formData.username.trim()) {
      alert('Username is required');
      return;
    }

    if (!formData.displayName.trim()) {
      alert('Display name is required');
      return;
    }

    if (!formData.password.trim()) {
      alert('Password is required');
      return;
    }

    performRegister(formData, {
      onSuccess: (data) => {
        setUser(data.user);
        alert(`Registration successful! Welcome, ${data.user.display_name}!`);
      },
      onError: (error) => {
        console.error('Registration error:', error);
      }
    });
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