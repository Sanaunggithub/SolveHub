import { FaChartLine, FaUserFriends } from "react-icons/fa";
import MemberProfile from "../components/MemberProfile";
import MemberActivity from "../components/MemberAcitivity";
import MemberContactInfo from "../components/MemberContactInfo";
import MemberAbout from "../components/MemberAbout"
import MemberSkills from "../components/MemberSkills";
import MemberRecentActivity from "../components/MemberRecentActivity";
import MemberConnectionPeople from "../components/MemberConnectionPeople";
import Footer from "../components/Footer"

export default function Member() {
  const skills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "UI/UX",
    "Poject Management"
  ];

  return (
    <>
      <section className="p-4 md:p-6 flex flex-col gap-6">

      {/* First Row: Full-width MemberProfile card */}
      <div className="w-full">
        <MemberProfile />
      </div>

      {/* Second Section: 3 cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MemberActivity
          icon={FaChartLine}
          title="Activity"
          count="124"
          subtitle="posts this month"
        />
        <MemberActivity
          icon={FaUserFriends}
          title="Connections"
          count="58"
          subtitle="mutual connections"
        />
        <MemberContactInfo 
          linkedin="linkedin.com/in/johndoe"
          github="github.com/johndoe"
          twitter="@johndoe"
          web="jondoe.dev"
        />
      </div>

      {/* Third Section: 2 cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column group */}
        <div className="flex flex-col gap-4">
          <MemberAbout />
          <MemberRecentActivity />
        </div>

        {/* Right column group */}
        <div className="flex flex-col gap-4">
          <MemberSkills skills={skills} />
          <MemberConnectionPeople />
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}
