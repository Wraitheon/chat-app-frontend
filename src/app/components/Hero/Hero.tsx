'use client';

import Image from 'next/image';
import { Righteous, Roboto } from 'next/font/google';
import styles from './Hero.module.scss';
import type { FC } from 'react';

// Load the Righteous font
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

type HeroProps = {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

const Hero: FC<HeroProps> = ({ onSignupClick, onLoginClick }: HeroProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={`${styles.headline} ${righteous.className}`}>
          Communicate, Anywhere, Anytime
        </h1>
        <p className={`${styles.subheadline} ${roboto.className}`}>
          Connect effortlessly across all devices with Pulse. Break free from
          limitations and redefine communication, anytime, anywhere.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.signupButton} onClick={onSignupClick}>Signup</button>
          <button className={styles.loginButton} onClick={onLoginClick}>Login</button>
        </div>
      </div>
      <div className={styles.illustration}>
        <Image
          src="/assets/Hero1.svg"
          alt="Illustration of global communication"
          width={700}
          height={500}
          priority
        />
      </div>
      <div className={styles.scrollIndicator}>
        <Image src="/assets/header1.svg" alt="scroll down" width={24} height={24} />
      </div>
    </section>
  );
};

export default Hero;
