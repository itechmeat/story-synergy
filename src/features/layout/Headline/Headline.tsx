import { FC, PropsWithChildren, ReactNode } from 'react'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { useLockBodyScroll } from 'react-use'
import { clearDatabase } from '../../../api/db'
import { useLayoutStore } from '../layoutStore'
import styles from './Headline.module.scss'

type HeadlineProps = {
  navSlot?: ReactNode
  userSlot?: ReactNode
}

export const Headline: FC<PropsWithChildren<HeadlineProps>> = ({ navSlot, userSlot, children }) => {
  const { isMenuOpened, setIsMenuOpened } = useLayoutStore()
  useLockBodyScroll(isMenuOpened)

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <NavLink to="/" className={styles.logo}>
          StorySynergy
        </NavLink>
        {navSlot}
        <NavLink to="/stories" className={styles.menu}>
          Stories
        </NavLink>
        {navSlot}
        <div className={styles.space} />
        {children && <div className={styles.inner}>{children}</div>}
        <div className={styles.space} />
        {userSlot}
        <Button onClick={clearDatabase}>Clear Database</Button>
        {userSlot}
        <Button
          className={styles.burger}
          shape="circle"
          icon={isMenuOpened ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setIsMenuOpened(!isMenuOpened)}
        />
      </div>
    </header>
  )
}
