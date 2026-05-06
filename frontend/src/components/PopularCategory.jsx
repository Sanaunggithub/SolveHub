import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function PopularCategory() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // runs once on first load
    useEffect(() => {
        fetchPopularCategories();
    }, []);

    const fetchPopularCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/discussions");
            
            // Count discussions by category
            const categoryCount = {};
            response.data.forEach(discussion => {
                const category = discussion.category || "General";
                // if a new category, set to 0
                if (!categoryCount[category]) {
                    categoryCount[category] = { category, count: 0 };
                }
                categoryCount[category].count++;
            });
            
            // Get top 5 categories
            const topCategories = Object.values(categoryCount)
                .sort((a, b) => b.count - a.count) // descending
                .slice(0, 5)
                .map(item => ({
                    title: item.category,
                    posts: item.count,
                    topics: Math.ceil(item.count / 3) // Estimate topics
                }));
            
            setTopics(topCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    function addNewTopic(){
        setTopics(prevTopic => [...prevTopic, { title: "New Topic", posts: 0, topics: 0 }])
    }
    
    return(
        <section className="shadow-lg rounded-lg p-3 bg-white w-full">
            <div className="flex">
                <div className="text-xl font-bold text-gray-800">Popular Category</div>      
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 p-0">
                {loading ? (
                    <div className="col-span-2 text-center text-gray-500 py-4">Loading categories...</div>
                ) : topics.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-4">No categories found</div>
                ) : (
                    topics.map((topic, index) => {
                        return(
                            <div 
                            key={index} 
                            className="shadow-md p-2 border rounded text-gray-700"
                            >
                            <div className="font-semibold">{topic.title}</div>
                            <div className="flex justify-between text-sm text-gray-500 mt-1">                                
                                <span>{topic.topics} topics</span>
                                <span>{topic.posts} posts</span>
                            </div>
                            </div>
                        )
                    })
                )}
            </div>

        </section>
    )
}