import { FaUser } from "react-icons/fa";

export default function MemberRecentActivity() {
  const activities = [
    { user: "Alex Johnson", action: "Posted a new article", title: "Understanding Modern Web Development Trends", time: "2 hours ago" },
    { user: "Maria Gracia", action: "Shared a project", title: "Building a React Dashboard", time: "5 hours ago" },
    { user: "Sam Wilson", action: "Commented on a discussion", title: "CSS Grid vs Flexbox", time: "1 day ago" },
    { user: "Lily Smith", action: "Started a new discussion", title: "Best practices in Node.js", time: "2 days ago" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-4">
          {/* Left column: Icon */}
          <div className="flex flex-col justify-start">
            <FaUser size={30} className="text-gray-400" />
          </div>

          {/* Right column: Activity info */}
          <div className="flex flex-col">
            <div className="text-gray-700 text-sm font-bold">{activity.action}</div>
            <div className="text-sm text-gray-500">{activity.title}</div>
            <div className="text-gray-400 font-bold text-sm">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
