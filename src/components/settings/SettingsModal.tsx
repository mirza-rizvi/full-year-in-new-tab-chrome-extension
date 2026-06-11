import { useComputed } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { settingsModalOpen } from '@/state/store';
import { t } from '@/i18n/messages';
import SettingsForm from './SettingsForm';
import styles from './SettingsModal.module.css';

export function openSettings(): void {
  settingsModalOpen.value = true;
}

export function closeSettings(): void {
  settingsModalOpen.value = false;
}

export default function SettingsModal() {
  const open = useComputed(() => settingsModalOpen.value);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open.value) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSettings();
      }
    };
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => window.removeEventListener('keydown', onKey);
  }, [open.value]);

  if (!open.value) return null;

  return (
    <div class={styles.scrim} role="presentation" onClick={closeSettings}>
      <div
        class={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={t('settingsTitle')}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header class={styles.head}>
          <div>
            <h1 class={styles.title}>{t('settingsTitle')}</h1>
            <p class={styles.subtitle}>{t('settingsSubtitle')}</p>
          </div>
          <button
            type="button"
            class={styles.close}
            onClick={closeSettings}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </header>
        <div class={styles.body}>
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
