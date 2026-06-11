(function () {
  try {
    var raw = localStorage.getItem('fyi:calendar-settings');
    var settings = raw ? JSON.parse(raw) : {};
    var pref = settings && settings.themePreference;
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved =
      pref === 'dark'
        ? 'dark'
        : pref === 'light'
        ? 'light'
        : systemDark
        ? 'dark'
        : 'light';
    document.documentElement.dataset.theme = resolved;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
