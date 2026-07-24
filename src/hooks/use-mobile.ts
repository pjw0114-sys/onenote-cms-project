import * as React from "react"

const MOBILE_BREAKPOINT = 768

// shadcn CLI 원본은 마운트 시 effect 본문에서 setState를 동기 호출해
// eslint-plugin-react-hooks의 set-state-in-effect 규칙과 충돌했다.
// lazy initial state로 초기값을 계산해, effect는 리스너 등록/해제만 담당하도록 수정.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
