import { FaUser, FaEnvelope } from "react-icons/fa";

export default function MemberProfile() {
  return (
    <section className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-center w-full">
      {/* Left side: User info */}
      <div className="flex items-center gap-4">
        <FaUser size={50} className="text-gray-400" />
        <div className="flex flex-col">
          <div className="text-lg font-bold text-gray-800">Alex Johnson</div>
          <div className="text-sm text-gray-500">Senior Developer</div>
          <div className="text-sm text-gray-500">Member since Jan 2022</div>
        </div>
      </div>

      {/* Right side: Action button */}
      <button className="mt-4 md:mt-0 bg-blue-500 text-white px-4 py-2 flex items-center gap-2 rounded hover:bg-blue-600 transition w-auto flex-shrink-0">
        <FaEnvelope size={15} /> Send Message
      </button>
    </section>
  );
}
