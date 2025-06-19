'use client';

import Image from 'next/image';
import styles from './Input.module.scss';

type InputProps = {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  helperTextColor?: string;
  showPasswordStrengthIcon?: boolean;
  successText?: string;
  icon?: string;
};

const Input = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  helperTextColor,
  showPasswordStrengthIcon,
  successText,
  icon,
}: InputProps) => {
  const status = error ? 'error' : successText ? 'success' : 'default';

  // Simple checkmark icon using CSS/Unicode instead of SVG
  const CheckmarkIcon = () => (
    <span className={styles.checkmarkIcon}>✓</span>
  );

  return (
    <div className={styles.inputWrapper}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${styles[status]}`}
        autoComplete="off"
      />
      <div className={styles.message}>
        {/* Show password strength icon or regular icon */}
        {showPasswordStrengthIcon && <CheckmarkIcon />}
        {icon && status === 'success' && !showPasswordStrengthIcon && (
          <Image src={icon} alt="success icon" width={16} height={16} />
        )}

        {/* Error message */}
        {error && <p className={styles.errorText}>{error}</p>}

        {/* Helper text with optional custom color */}
        {helperText && (
          <p
            className={styles.helperText}
            style={{ color: helperTextColor || undefined }}
          >
            {helperText}
          </p>
        )}

        {/* Success text */}
        {successText && <p className={styles.successText}>{successText}</p>}
      </div>
    </div>
  );
};

export default Input;