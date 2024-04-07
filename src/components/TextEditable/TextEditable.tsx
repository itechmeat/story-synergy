import { FC } from 'react'
import cn from 'classnames'
import styles from './TextEditable.module.scss'

type TextEditableProps = {
  text?: string
  disabled?: boolean
  editable?: boolean
  className?: string
  onChange?: (value: string) => void
}

export const TextEditable: FC<TextEditableProps> = ({
  text,
  editable,
  disabled,
  className,
  onChange,
}) => {
  // const clearText = useMemo(() => {
  //   const regex = /(<([^>]+)>)/gi
  //   return text?.replace(regex, '')
  // }, [text])

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const innerText = e.currentTarget.innerHTML
    if (!onChange || innerText === text) return
    onChange(innerText)
  }

  return (
    <div
      className={cn(styles.text, className)}
      contentEditable={editable && !disabled}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: text || '' }}
      onBlur={handleBlur}
    />
  )
}
