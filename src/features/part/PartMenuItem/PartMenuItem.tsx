import { FC } from 'react'
import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps } from 'antd'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { UUID } from '../../../types/common'
import usePartStore from '../partStore'
import styles from './PartMenuItem.module.scss'

interface PartProps {
  storyId: UUID
  partId: UUID
  isActive: boolean
}

export const PartMenuItem: FC<PartProps> = ({ storyId, partId, isActive }) => {
  const { setActivePartId } = usePartStore()

  const part = usePartStore(state => state.getPartById(partId))

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Add chapter',
      onClick: () => console.log('1st menu item'),
    },
    {
      key: '2',
      label: 'Add part above',
      onClick: () => console.log('2nd menu item'),
    },
    {
      key: '3',
      label: 'Add part below',
      onClick: () => console.log('3rd menu item'),
    },
  ]

  if (!part) return null

  return (
    <div className={cn(styles.part, { [styles.active]: isActive })}>
      <NavLink
        to={`/stories/${storyId}/${partId}`}
        className={styles.link}
        onMouseDown={() => setActivePartId(partId)}
      >
        {part.title}
      </NavLink>
      <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
        <button className={styles.plusButton}>
          <MoreOutlined />
        </button>
      </Dropdown>
    </div>
  )
}
