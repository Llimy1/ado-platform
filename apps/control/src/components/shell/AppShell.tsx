"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppShell.module.css";
import { NAV_ITEMS } from "./nav-items";
import { Button } from "@/components/Button";
import { IconMenu, IconClose } from "@/components/icons";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className={styles.navList}>
      {NAV_ITEMS.map((item) => {
        const active = item.implemented && pathname.startsWith(item.href) && item.href !== "#";
        const Icon = item.icon;
        if (!item.implemented) {
          return (
            <li key={item.key}>
              <span
                className={[styles.navLink, styles.navLinkDisabled].join(" ")}
                aria-disabled="true"
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                <span className={styles.navBadge}>준비 중</span>
              </span>
            </li>
          );
        }
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              className={[styles.navLink, active ? styles.navLinkActive : ""].join(" ")}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<Element | null>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      openerRef.current = document.activeElement;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      onClose();
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog ref={ref} className={styles.drawer} aria-label="탐색 메뉴">
      <div className={styles.drawerInner}>
        <div className={styles.drawerHeader}>
          <span className={styles.brand}>ADO Control Room</span>
          <Button variant="icon" aria-label="메뉴 닫기" dense onClick={() => ref.current?.close()}>
            <IconClose />
          </Button>
        </div>
        <nav aria-label="주 탐색">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return item.implemented ? (
                <li key={item.key}>
                  <Link href={item.href} className={styles.drawerNavLink} onClick={() => ref.current?.close()}>
                    <Icon className={styles.navIcon} />
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li key={item.key}>
                  <span className={[styles.drawerNavLink, styles.navLinkDisabled].join(" ")} aria-disabled="true">
                    <Icon className={styles.navIcon} />
                    {item.label} <span className={styles.navBadge} style={{ display: "inline" }}>준비 중</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Button
            variant="icon"
            aria-label="메뉴 열기"
            dense
            className={styles.menuButton}
            onClick={() => setDrawerOpen(true)}
          >
            <IconMenu />
          </Button>
          <span className={styles.brand}>ADO Control Room</span>
        </div>
        <div className={styles.topbarRight}>
          <Link href="/system" className={styles.systemHealthLink}>
            System Health
          </Link>
          <span className={styles.operator}>Human Owner</span>
        </div>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar} aria-label="주 탐색">
          <div className={styles.sidebarSticky}>
            <NavLinks />
          </div>
        </nav>
        <main className={styles.main}>
          <div className={styles.mainInner}>{children}</div>
        </main>
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
