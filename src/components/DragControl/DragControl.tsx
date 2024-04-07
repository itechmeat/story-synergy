import { FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import cn from 'classnames'
import { UUID } from '../../types/common'
import styles from './DragControl.module.scss'

type DragControlProps = {
  className?: string
  id: UUID
}

export const DragControl: FC<DragControlProps> = ({ className, id }) => {
  const { listeners } = useSortable({
    id,
  })

  return <span className={cn(styles.control, className)} {...listeners} />
}
