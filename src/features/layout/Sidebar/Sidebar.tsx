import { FC, PropsWithChildren } from 'react'
import cn from 'classnames'
import styles from './Sidebar.module.scss'

type SidebarProps = {
  className?: string
}

export const Sidebar: FC<PropsWithChildren<SidebarProps>> = ({ children, className }) => {
  return <aside className={cn(styles.sidebar, className)}>{children}</aside>
}
