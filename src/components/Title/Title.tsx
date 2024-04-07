import { FC, createElement } from 'react'
import cn from 'classnames'
import styles from './Title.module.scss'

type TitleProps = {
  level?: 1 | 2 | 3 | 4
  text?: string
  disabled?: boolean
  editable?: boolean
  className?: string
  onChange?: (value: string) => void
}

export const Title: FC<TitleProps> = ({
  text,
  level = 1,
  editable,
  disabled,
  className,
  onChange,
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const innerText = e.currentTarget.innerText
    if (!onChange || innerText === text) return
    onChange(innerText)
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return createElement(Tag, {
    className: cn(styles.title, className),
    contentEditable: editable && !disabled,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    children: text,
  })
}
