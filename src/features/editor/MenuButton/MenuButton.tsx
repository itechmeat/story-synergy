import { FC, PropsWithChildren } from 'react'
import cn from 'classnames'
import styles from './MenuButton.module.scss'

export type OnChangeCallback = (files: File[]) => void
type MenuButtonProps = {
  iconId?: string
  disabled?: boolean
  isActive?: boolean
  onClick?: () => void
  onImageChange?: OnChangeCallback
  onAudioChange?: OnChangeCallback
}

export const MenuButton: FC<PropsWithChildren<MenuButtonProps>> = ({
  children,
  iconId,
  disabled,
  isActive,
  onClick,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(styles.button, { [styles.active]: isActive })}
      onClick={onClick}
      {...props}
    >
      {iconId && <span className={styles.icon}>{iconId}</span>}
      {children && <span className={styles.children}>{children}</span>}
    </button>
  )
}
