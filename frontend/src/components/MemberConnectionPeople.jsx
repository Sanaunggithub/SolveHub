import { FaUser } from "react-icons/fa";

export default function MemberConnectionPeople() {
  const connections = [
    { name: "Alex Johnson", role: "Frontend Developer" },
    { name: "Maria Gracia", role: "UI/UX Designer" },
    { name: "Sam Wilson", role: "Backend Engineer" },
    { name: "Lily Smith", role: "Project Manager" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="font-bold text-gray-800 text-lg">Connections</div>
        <button className="text-blue-500 text-sm hover:underline">
          View all
        </button>
      </div>

      {/* Connection List */}
      <div className="flex flex-col gap-3">
        {connections.map((user, index) => (
          <div key={index} className="flex items-center gap-3">
            <FaUser size={30} className="text-gray-400" />
            <div className="flex flex-col">
              <div className="font-semibold text-gray-700 text-sm">{user.name}</div>
              <div className="text-gray-500 text-xs">{user.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
