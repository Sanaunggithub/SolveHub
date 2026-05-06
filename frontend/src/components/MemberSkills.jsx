export default function MemberSkills({ skills }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="font-bold text-gray-800 mb-2">Skills</div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-sm"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}
