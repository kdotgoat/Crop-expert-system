const SEVERITY_STYLES = {
  high:     'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
  moderate: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
  low:      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
  minimal:  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700',
};

const SEVERITY_ICONS = {
  high:     '🔴',
  moderate: '🟠',
  low:      '🟡',
  minimal:  '⚪',
};

export default function SeverityBadge({ severity, label }) {
  const key = (severity || '').toLowerCase();
  const styles = SEVERITY_STYLES[key] || SEVERITY_STYLES.minimal;
  const icon   = SEVERITY_ICONS[key]  || '⚪';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border tracking-wide ${styles}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}