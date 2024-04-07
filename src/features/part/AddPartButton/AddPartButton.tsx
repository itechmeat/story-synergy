import { FC, MouseEvent, PropsWithChildren } from 'react'
import styles from './AddPartButton.module.scss'

type AddPartButtonProps = {
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const AddPartButton: FC<PropsWithChildren<AddPartButtonProps>> = ({
  children,
  disabled,
  onClick,
  ...rest
}) => {
  return (
    <button className={styles.plus} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
