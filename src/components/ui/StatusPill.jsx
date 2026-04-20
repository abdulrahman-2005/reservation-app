export default function StatusPill({ status }) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "قيد الانتظار",
    },
    confirmed: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "مؤكد",
    },
    completed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "مكتمل",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "ملغي",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
