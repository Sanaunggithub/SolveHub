import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Footer() {
    // state for newsletter input and subscription status
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e?.preventDefault();
        if (!email || email.trim() === "") {
            alert("Please enter your email");
            return;
        }

        alert("You have subscribed");
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="bg-gray-900 text-white py-8 px-6">

            {/* Top columns */}
            <div className="flex flex-col md:flex-row justify-between gap-8">

                {/* Column 1 */}
                <div className="flex flex-col gap-0">
                    <div className="text-base font-bold">Community Forum</div>
                    <div className="text-sm text-gray-400">
                        A place for meaningful discussions and knowledge sharing.
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-1">
                    <div className="text-base font-bold">Quick Links</div>
                    <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                        <ChevronRight size={16} /> Home
                    </Link>
                    <Link to="/discussions" className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                        <ChevronRight size={16} /> Forums
                    </Link>
                    <Link to="/members" className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                        <ChevronRight size={16} /> Members
                    </Link>
                    <Link to="/blogs" className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                        <ChevronRight size={16} /> Blogs
                    </Link>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-1">
                    <div className="text-base font-bold">Categories</div>
                    {/** Dynamic categories loaded from discussions */}
                    {/** Render up to 6 categories */}
                    <DynamicCategories />
                </div>

                {/* Column 4 */}
                <div className="flex flex-col gap-1">
                    <div className="text-base font-bold">Connect With Us</div>
                    <div className="flex flex-row gap-3 mt-1 text-gray-400">
                        <FaFacebookF className="hover:text-blue-600 cursor-pointer" size={20} />
                        <FaTwitter className="hover:text-blue-400 cursor-pointer" size={20} />
                        <FaLinkedinIn className="hover:text-blue-700 cursor-pointer" size={20} />
                        <FaYoutube className="hover:text-red-600 cursor-pointer" size={20} />
                    </div>
                    <div className="text-base text-gray-400 my-2">Subscribe to our newsletter</div>
                    <div className="flex w-full max-w-md">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="flex-1 bg-white placeholder-black placeholder:text-sm p-2 rounded-l border border-gray-300 focus:outline-none"
                        />
                        <button
                            onClick={handleSubscribe}
                            disabled={subscribed}
                            className={`p-3 rounded-r flex items-center justify-center ${subscribed ? "bg-gray-500 cursor-default" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            <FaPaperPlane className="text-white" size={18} />
                        </button>
                    </div>
                    {/* optional inline confirmation */}
                    {subscribed && <div className="text-sm text-green-400 mt-2">You have subscribed.</div>}
                </div>
            </div>

            {/* Horizontal line */}
            <hr className="border-gray-700 my-6" />

            {/* Footer bottom text */}
            <p className="text-center text-gray-400 text-sm">
                &copy;2025 Community Forum. All rights reserved.
            </p>
        </footer>
    )
}

function DynamicCategories() {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchCats = async () => {
            try {
                setLoading(true);
                // fetch upto 1000 discussions
                const res = await api.get('/discussions', { params: { skip: 0, limit: 1000 } });
                const seen = new Set(); 
                const list = [];
                // loop through each discussion
                res.data.forEach(d => {
                    let c = d.category;
                    if (Array.isArray(c)) c = c[0];
                    if (!c) c = 'General';
                    if (!seen.has(c)) {
                        seen.add(c);
                        list.push(c);
                    }
                });
                if (mounted) setCats(list.slice(0, 6)); // only 6 categories
            } catch (err) {
                console.error('Error fetching categories for footer', err);
                if (mounted) setCats([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchCats();
        // clean up mount
        return () => { mounted = false }
    }, [])

    if (loading) return <div className="text-gray-400">Loading...</div>
    if (cats.length === 0) return <div className="text-gray-400">No categories</div>

    return (
        <>
            {cats.map((cat, idx) => (
                <Link key={idx} to={`/discussions?category=${encodeURIComponent(cat)}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                    <ChevronRight size={16} /> {cat}
                </Link>
            ))}
        </>
    )
}