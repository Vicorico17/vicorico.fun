import * as React from "react"
import { createRoot } from "react-dom/client"
import { Palette } from "lucide-react"
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar"
import "./globals.css"

const languages = [
  { code: "en", label: "English", flag: "gb" },
  { code: "ro", label: "Română", flag: "ro" },
  { code: "es", label: "Español", flag: "es" },
  { code: "fr", label: "Français", flag: "fr" },
  { code: "de", label: "Deutsch", flag: "de" },
  { code: "zh-CN", label: "简体中文", flag: "cn" },
  { code: "ar", label: "العربية", flag: "ar" },
]
const themes = [
  { value: "signal", label: "Signal", icon: "📡" },
  { value: "paper", label: "Paper", icon: "📜" },
  { value: "grove", label: "Grove", icon: "🌿" },
]

function SiteNavigation() {
  const [active, setActive] = React.useState(0)
  const [panel, setPanel] = React.useState<"language" | "theme" | null>(null)
  const [language, setLanguage] = React.useState(document.documentElement.lang)
  const [theme, setTheme] = React.useState(document.body.dataset.theme || "signal")
  const [status, setStatus] = React.useState("")
  const wrapper = React.useRef<HTMLDivElement>(null)
  const pendingLanguage = React.useRef(false)
  const currentLanguage = languages.find(item => item.code === language) || languages[0]
  const focusTrigger = (index: number) => wrapper.current?.querySelectorAll<HTMLButtonElement>(".nimbus-item")[index]?.focus()

  React.useEffect(() => {
    // Keep the existing translation/theme engines and their no-React fallback.
    const legacy = document.querySelector<HTMLElement>(".portal-nav")
    if (legacy) legacy.hidden = true
    const update = () => {
      setLanguage(document.documentElement.lang)
      setTheme(document.body.dataset.theme || "signal")
      const message = document.querySelector("[data-language-status]")?.textContent || ""
      setStatus(message)
      const busy = document.querySelector("[data-language-menu]")?.hasAttribute("aria-busy")
      if (pendingLanguage.current && !busy) {
        pendingLanguage.current = false
        if (!message) { setPanel(null); focusTrigger(0) }
      }
    }
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] })
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] })
    const menu = document.querySelector("[data-language-menu]")
    if (menu) observer.observe(menu, { attributes: true, attributeFilter: ["aria-busy"], childList: true, subtree: true, characterData: true })
    update()
    return () => { observer.disconnect(); if (legacy) legacy.hidden = false }
  }, [])

  React.useEffect(() => {
    if (!panel) return
    const outside = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setPanel(null)
    }
    document.addEventListener("pointerdown", outside)
    return () => document.removeEventListener("pointerdown", outside)
  }, [panel])

  const items: LiquidNavItem[] = [
    { label: currentLanguage.label, icon: <img src={`assets/flags/${currentLanguage.flag}.svg`} width={22} height={16} alt="" />, fx: "spin", translate: "no",
      onClick: () => setPanel(value => value === "language" ? null : "language"), expanded: panel === "language", controls: "liquid-language-options" },
    { label: "Themes", icon: <Palette size={18} />, fx: "pop",
      onClick: () => setPanel(value => value === "theme" ? null : "theme"), expanded: panel === "theme", controls: "liquid-theme-options" },
    { label: "Vico’s Quest", href: "game.html", icon: <img src="assets/vicos-quest.svg" width={24} height={24} alt="" />, fx: "pop", translate: "no" },
  ]

  return <div ref={wrapper} onKeyDown={event => {
    if (event.key === "Escape" && panel) {
      event.preventDefault(); setPanel(null); focusTrigger(panel === "language" ? 0 : 1)
    }
    if (event.key === "ArrowDown" && (event.target as HTMLElement).closest(".nimbus-item")) {
      const index = Array.from(wrapper.current!.querySelectorAll(".nimbus-item")).indexOf(event.target as Element)
      if (index < 0 || index > 1) return
      event.preventDefault()
      setPanel(index === 0 ? "language" : "theme")
      requestAnimationFrame(() => wrapper.current?.querySelector<HTMLButtonElement>(".liquid-options:not([hidden]) button")?.focus())
    }
  }} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPanel(null)
  }}>
    <LiquidNavbar items={items} active={active} onChange={setActive} tone={theme === "paper" ? "light" : "dark"} sound={false} compact={false} />
    <div className="liquid-options" id="liquid-language-options" role="group" aria-label="Website language" hidden={panel !== "language"} translate="no">
      {languages.map(item => <button key={item.code} type="button" lang={item.code} dir="auto" aria-pressed={language === item.code} onClick={() => {
        const button = document.querySelector<HTMLButtonElement>(`[data-language="${item.code}"]`)
        if (button) { pendingLanguage.current = true; button.click() }
      }}><img src={`assets/flags/${item.flag}.svg`} width={24} height={16} alt="" /><span>{item.label}</span></button>)}
      <p role="status">{status}</p>
    </div>
    <div className="liquid-options" id="liquid-theme-options" role="group" aria-label="Choose website theme" hidden={panel !== "theme"}>
      {themes.map(item => <button key={item.value} type="button" aria-pressed={theme === item.value} onClick={() => {
        document.querySelector<HTMLButtonElement>(`[data-theme-option="${item.value}"]`)?.click()
        setPanel(null); focusTrigger(1)
      }}><span aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}
    </div>
  </div>
}
const host = document.getElementById("liquid-navbar-root")
if (host) createRoot(host).render(<SiteNavigation />)
