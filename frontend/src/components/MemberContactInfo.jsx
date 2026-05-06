import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";

export default function MemberContactInfo({linkedin, github, twitter, web}) {
    return(
        <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
            <div className="font-bold text-gray-800">Contact Information</div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaLinkedin className="text-black" size={16} /> {linkedin}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaGithub className="text-black" size={16} /> {github}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaTwitter className="text-black" size={16} /> {twitter}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaGlobe className="text-black" size={16} /> {web}
            </div>
        </div>
    )
}