import { useParams } from 'react-router-dom';
import { RoadmapVisualizer } from '../../Components';

const Roadmap = () => {
    const { id } = useParams();
    
    return (
        <div className="container  mx-auto px-4 py-8">
            <RoadmapVisualizer roadmapSlug={id || "competitive"} />
        </div>
    );
};

export default Roadmap;