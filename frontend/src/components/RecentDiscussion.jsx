import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api/axios";

export default function RecentDiscussion() {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentDiscussions();
    }, []);

    const fetchRecentDiscussions = async () => {
        try {
            setLoading(true);
            const response = await api.get("/discussions", {
                params: {
                    skip: 0,
                    limit: 100
                }
            });
            
            // Get latest 5 discussions and compute relative times
            const recentDiscussions = response.data
                .slice(0, 5)
                .map(discussion => {
                    // if category is array, take first value
                    const cat = Array.isArray(discussion.category) ? (discussion.category[0] || "General") : (discussion.category || "General");

                    // compute time ago from created_at (or updated_at)
                    const timestamp = discussion.updated_at || discussion.created_at;
                    const lastPost = computeTimeAgo(timestamp);

                    return {
                        id: discussion.id,
                        question: discussion.title,
                        startBy: discussion.author?.full_name || "Unknown User",
                        field: `in ${cat}`,
                        views: discussion.views || 0,
                        lastPost
                    }
                });
            
            setDiscussions(recentDiscussions);
        } catch (error) {
            console.error("Error fetching discussions:", error);
            setDiscussions([]);
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
        <section className="bg-white shadow-lg p-3 rounded-lg w-full">
            <div className="px-4 pt-4 pb-2 text-xl font-bold text-gray-800">
                Recent Discussions
            </div>

            <div className="flex flex-col">
                {loading ? (
                    <div className="px-4 py-4 text-center text-gray-500">Loading discussions...</div>
                ) : discussions.length === 0 ? (
                    <div className="px-4 py-4 text-center text-gray-500">No discussions found</div>
                ) : (
                    discussions.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between px-4 py-2 text-sm text-gray-700"
                    >
                        <div className="w-full flex flex-col">
                            {/* Question title */}
                            <span className="font-semibold text-gray-800">{item.question}</span>

                            {/* Started by + Field */}
                            <div className="flex space-x-4 text-md text-gray-500 mt-1">
                                Started by<span className="ml-4 font-semibold tex-gray-600">{item.startBy}</span>
                                <span>{item.field}</span>
                            </div>

                            {/* Post properties */}
                            <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                                <span>{item.views} views</span>
                                <span>Last Post: {item.lastPost}</span>
                            </div>

                            <hr className="border-gray-200 mt-3" />
                        </div>            
                    </div>
                    ))
                )}
            </div>
            <Link to="/discussions" className="flex text-blue-600 hover:underline justify-center"> View All Discussions<ArrowRight className="w-5 h-6" /> </Link>
        </section>
    )
}