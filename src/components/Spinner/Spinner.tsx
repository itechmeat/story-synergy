import { FC } from 'react'
import cn from 'classnames'
import { Size } from '@/types/ui'
import styles from './Spinner.module.scss'

type SpinnerProps = {
  size?: Size
}

export const Spinner: FC<SpinnerProps> = ({ size = Size.MEDIUM }) => {
  return <span className={cn(styles.spinner, styles[size])} />
}
