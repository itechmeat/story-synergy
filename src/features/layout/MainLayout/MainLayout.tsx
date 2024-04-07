import { FC, PropsWithChildren } from 'react'
// import { Menu } from 'antd'
// import { Footer } from '../Footer/Footer'
import { Headline } from '../Headline/Headline'
import styles from './MainLayout.module.scss'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Headline></Headline>

      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
