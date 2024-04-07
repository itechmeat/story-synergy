import { FC } from 'react'
import styles from './Footer.module.scss'

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.copyright}>StorySynergy ©2024</div>
      </div>
    </footer>
  )
}
