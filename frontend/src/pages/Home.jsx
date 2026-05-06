import Welcome from "../components/Welcome";
import PopularCategory from "../components/PopularCategory";
import ForumStatistics from "../components/ForumStatistics";
import TopContributer from "../components/TopContributer";
import RecentDiscussion from "../components/RecentDiscussion";
import RecentActivity from "../components/RecentActivity";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
        {!isAuthenticated && <Welcome />}

        <div className="bg-gray-100 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                {/* PopularCategory: takes 2/3 on desktop, full width on mobile */}
                <div className="w-full md:col-span-2 flex flex-col gap-4">
                  <PopularCategory/>
                  <RecentDiscussion />
                  
                </div>

                {/* ForumStatistics: takes 1/3 on desktop, full width on mobile, height fits content */}
                <div className="w-full flex flex-col gap-4">
                  <ForumStatistics />
                  <TopContributer />
                  <RecentActivity />
                </div>
            </div>
        </div>

        <Footer />
    </>
  );
}
