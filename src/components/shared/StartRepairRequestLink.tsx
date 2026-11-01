import { Link, type LinkProps } from 'react-router-dom'

import { useAuthSession } from '@/hooks/useAuthSession'
import { getStartRepairRequestPath } from '@/lib/repair-entry'

type StartRepairRequestLinkProps = Omit<LinkProps, 'to'>

/**
 * @description Routes repair CTAs to new-repair when signed in, otherwise login with redirect.
 */
export function StartRepairRequestLink({
  children = 'Start a repair request',
  ...props
}: StartRepairRequestLinkProps) {
  const { isAuthenticated } = useAuthSession()

  return (
    <Link to={getStartRepairRequestPath(isAuthenticated)} {...props}>
      {children}
    </Link>
  )
}
