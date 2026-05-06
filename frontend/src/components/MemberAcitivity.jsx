export default function MemberActivity({ icon: Icon, title, count, subtitle }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Icon */}
      <div className={`bg-gray-100 p-3 rounded-full`}>
        <Icon className={`text-black`} size={16} />
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <div className="text-gray-800 font-semibold text-lg">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}
