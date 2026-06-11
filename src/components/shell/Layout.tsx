import Header from './Header';
import Calendar from '../calendar/Calendar';
import SettingsModal from '../settings/SettingsModal';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div class={styles.shell}>
      <main class={styles.main}>
        <Header />
        <Calendar />
      </main>
      <SettingsModal />
    </div>
  );
}
