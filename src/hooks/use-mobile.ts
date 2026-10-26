import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/**
 * Hook d'abonnement externe : pas de setState dans un effet (compatible
 * lint react-hooks), valeur immédiate au premier rendu client, `false` en SSR.
 */
export function useIsMobile() {
  const getSnapshot = React.useCallback(
    () => window.matchMedia(MOBILE_QUERY).matches,
    [],
  )
  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
