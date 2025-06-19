// The 'use client' directive is necessary for components that use hooks like useState.
// If your dropdown is interactive, you'll need this.
// 'use client';

import Image from "next/image";
import Link from "next/link";
import { Saira_Stencil_One, Roboto } from 'next/font/google'
import styles from "./Header.module.scss";

const SairaStencilOne = Saira_Stencil_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.logo} ${SairaStencilOne.className}`}>
        <span>Pulse</span>
        <Image src="/assets/pulselogo.svg" alt="Pulse Logo" width={100} height={28} />
      </div>
      <nav className={`${styles.navigation} ${roboto.className}`}>
        <ul className={styles.navLinks}>
          <li><Link href="#">Privacy</Link></li>
          <li><Link href="#">Help Center</Link></li>
          <li><Link href="#">Pulse Web</Link></li>
          <li className={styles.downloadLink}>
            <Link href="#">Download</Link>
            <Image src="/assets/header1.svg" alt="dropdown arrow" width={16} height={16} />
          </li>
        </ul>
        <button className={styles.ctaButton}>Try Pulse</button>
      </nav>
    </header>
  );
};

export default Header;