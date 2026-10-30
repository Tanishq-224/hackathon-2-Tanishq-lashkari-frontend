import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import {
  customerRepairsQueryKey,
  repairDetailQueryKey,
  repairEstimatesQueryKey,
  repairQuotationQueryKey,
  vendorRepairsQueryKey,
} from '@/features/repairs/api/repairsApi'
import { notificationsQueryKey } from '@/features/notifications/api/notificationsApi'
import { useAuthSession } from '@/hooks/useAuthSession'
import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
  getRealtimeSocket,
} from '@/lib/realtime-socket'

type RepairUpdatedPayload = {
  repairRequestId: string
  reason?: string
}

/**
 * @description Keeps TanStack Query caches fresh via Socket.IO lifecycle events.
 * @returns {null}
 */
export function RealtimeSync() {
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading } = useAuthSession()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      disconnectRealtimeSocket()
      return
    }

    const socket = connectRealtimeSocket()

    function invalidateRepair(repairId: string) {
      void queryClient.invalidateQueries({ queryKey: repairDetailQueryKey(repairId) })
      void queryClient.invalidateQueries({ queryKey: repairEstimatesQueryKey(repairId) })
      void queryClient.invalidateQueries({ queryKey: repairQuotationQueryKey(repairId) })
    }

    function onInboxUpdate() {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
    }

    function onRepairUpdated(payload: RepairUpdatedPayload) {
      if (!payload?.repairRequestId) {
        return
      }
      invalidateRepair(payload.repairRequestId)
      void queryClient.invalidateQueries({ queryKey: customerRepairsQueryKey })
      void queryClient.invalidateQueries({ queryKey: vendorRepairsQueryKey })
    }

    function onMarketplaceUpdated() {
      void queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    }

    socket.on('inbox:update', onInboxUpdate)
    socket.on('repair:updated', onRepairUpdated)
    socket.on('marketplace:updated', onMarketplaceUpdated)

    return () => {
      socket.off('inbox:update', onInboxUpdate)
      socket.off('repair:updated', onRepairUpdated)
      socket.off('marketplace:updated', onMarketplaceUpdated)
    }
  }, [isAuthenticated, isLoading, queryClient])

  return null
}

/**
 * @description Joins a repair room while a detail view is mounted.
 * @param {string | undefined} repairId - Active repair ticket id.
 */
export function useRepairRealtimeSubscription(repairId: string | undefined): void {
  const { isAuthenticated } = useAuthSession()

  useEffect(() => {
    if (!repairId || !isAuthenticated) {
      return
    }

    const socket = getRealtimeSocket()

    function subscribe() {
      socket.emit('repair:subscribe', repairId)
    }

    if (socket.connected) {
      subscribe()
    }

    socket.on('connect', subscribe)

    return () => {
      socket.off('connect', subscribe)
      if (socket.connected) {
        socket.emit('repair:unsubscribe', repairId)
      }
    }
  }, [repairId, isAuthenticated])
}
