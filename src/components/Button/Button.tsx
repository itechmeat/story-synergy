import { FC, MouseEvent, PropsWithChildren, ReactElement } from 'react'
import cn from 'classnames'
import { Color, Size } from '../../types/ui'
import { Spinner } from '../Spinner/Spinner'
import styles from './Button.module.scss'

type ButtonProps = {
  color?: Color
  size?: Size
  startIcon?: ReactElement
  endIcon?: ReactElement
  href?: string
  disabled?: boolean
  isRounded?: boolean
  isOutlined?: boolean
  isLoading?: boolean
  isFullWidth?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  color = Color.DEFAULT,
  size = Size.MEDIUM,
  startIcon,
  endIcon,
  href,
  disabled,
  isLoading,
  isRounded,
  isOutlined,
  isFullWidth,
  children,
  onClick,
  ...rest
}) => {
  const classes = cn(
    styles.button,
    styles[color],
    styles[size],
    { [styles.iconButton]: !children && (startIcon || endIcon) },
    { [styles.disabled]: disabled },
    { [styles.rounded]: isRounded },
    { [styles.outlined]: isOutlined },
    { [styles.block]: isFullWidth },
    { [styles.loading]: isLoading },
  )

  const ButtonContent = () => {
    return (
      <>
        {startIcon && <span className={styles.start}>{startIcon}</span>}
        {children && <span className={styles.text}>{children}</span>}
        {endIcon && <span className={styles.end}>{endIcon}</span>}
        {isLoading && (
          <div className={styles.loader}>
            <Spinner />
          </div>
        )}
      </>
    )
  }

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        <ButtonContent />
      </a>
    )
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick} {...rest}>
      <ButtonContent />
    </button>
  )
}
