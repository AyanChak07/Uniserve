import { cn } from '../../utils/cn'

export const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn('bg-white rounded-lg shadow-md', className)}
      {...props}
    />
  )
}

export const CardHeader = ({ className, ...props }) => {
  return <div className={cn('p-6 pb-4', className)} {...props} />
}

export const CardContent = ({ className, ...props }) => {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
