import { useState, useEffect } from "react";
import api from "../api/axios";

export default function RecentActivity() {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentActivity();
    }, []);

    const fetchRecentActivity = async () => {
        try {
            setLoading(true);
            
            // Fetch recent discussions
            const discussionsResponse = await api.get("/discussions", {
                params: { skip: 0, limit: 100 }
            });

            // Format recent activities
            const recentActivities = discussionsResponse.data.slice(0, 3).map((discussion, index) => ({
                name: discussion.author?.full_name || "Unknown User",
                activity: `posted "${discussion.title.substring(0, 30)}..."`,
                status: computeTimeAgo(discussion.updated_at || discussion.created_at)
            }));

            setStatistics(recentActivities);
        } catch (error) {
            console.error("Error fetching recent activity:", error);
            setStatistics([]);
        } finally {
            setLoading(false);
        }
    };
    
    function computeTimeAgo(isoString){
        if(!isoString) return 'Unknown time';
        const then = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now - then) / 1000); // seconds
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
        if (diff < 604800) return `${Math.floor(diff/86400)} days ago`;
        return then.toLocaleDateString();
    }
    
    return(
        <section className="bg-white shadow-lg rounded-lg w-full">
        <div className="px-4 pt-4 pb-2 text-xl font-bold text-gray-800">
            Recent Activity
        </div>

        <div className="flex flex-col">
        {loading ? (
            <div className="px-4 py-4 text-center text-gray-500">Loading...</div>
        ) : statistics.length === 0 ? (
            <div className="px-4 py-4 text-center text-gray-500">No recent activity</div>
        ) : (
            statistics.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{item.name} </span>
                    <span className="font-bold text-gray-400 text-sm">{item.status} </span>
                </div>
                
                <span className= "px-2 py-1 text-xs text-gray-700"> {item.activity} </span>
              </div>
            ))
        )}
        </div>
        </section>
    )
}