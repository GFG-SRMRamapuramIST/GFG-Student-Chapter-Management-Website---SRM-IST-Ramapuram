import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiCode, FiDatabase, FiLayers } from 'react-icons/fi';

const AllRoadmaps = () => {
    // You would typically fetch this from an API
    const roadmaps = [
        {
            slug: "competitive",
            title: "Competitive Programming",
            description: "Master algorithms and problem-solving techniques for competitive programming contests.",
            icon: FiCode,
            color: "bg-gradient-to-br from-blue-500 to-indigo-600"
        },
        // Add more roadmaps as needed
        {
            slug: "frontend",
            title: "Frontend Development",
            description: "Learn modern frontend technologies and build responsive web applications.",
            icon: FiLayers,
            color: "bg-gradient-to-br from-emerald-500 to-teal-600"
        },
        {
            slug: "backend",
            title: "Backend Development",
            description: "Master server-side programming, APIs, and database management.",
            icon: FiDatabase,
            color: "bg-gradient-to-br from-purple-500 to-fuchsia-600"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Learning Roadmaps</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Follow structured learning paths to master different programming domains and skills.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roadmaps.map((roadmap) => (
                    <motion.div
                        key={roadmap.slug}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link 
                            to={`/roadmaps/${roadmap.slug}`}
                            className="block h-full"
                        >
                            <div className={`rounded-xl shadow-lg overflow-hidden h-full flex flex-col ${roadmap.color} text-white`}>
                                <div className="p-6">
                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                                        <roadmap.icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{roadmap.title}</h2>
                                    <p className="opacity-90">{roadmap.description}</p>
                                </div>
                                <div className="mt-auto p-4 pt-0 flex justify-end">
                                    <span className="inline-flex items-center font-medium">
                                        Explore Roadmap
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AllRoadmaps;