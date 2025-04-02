import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { RotatingCloseButton } from "../../Utilities";

const content = {
  "getting-started": {
    title: "Introduction",
    subsections: {
      "about-website": {
        title: "GeeksforGeeks Student Chapter - SRMIST",
        content: "  The GeeksforGeeks Student Chapter, SRMIST is a vibrant and driven community committed to bridging the gap between academic knowledge and industry demands. Our mission is to empower students with the technical expertise and problem-solving abilities required to thrive in the fast-evolving tech landscape. We focus extensively on Competitive Programming, treating it as a strategic discipline that sharpens analytical thinking, improves coding efficiency, and prepares students for coding contests and technical interviews. Our structured approach to Data Structures and Algorithms (DSA) ensures that even the most complex concepts are broken down into simplified, intuitive, and practical applications, making them easier to grasp and implement."},
      "why-needed": {
  title: "Website Overview",
  content: "This platform is a <span class=\"text-emerald-600\">comprehensive coding profile tracker</span> designed for competitive programmers. It integrates profiles from multiple platforms, displaying coding activity through a <span class=\"text-emerald-600\">heatmap</span> and enabling users to track progress effortlessly.\n\nA <span class=\"text-emerald-600\">dynamic leaderboard</span> allows users to compete with their close circle, compare profiles side by side, and stay motivated. <span class=\"text-emerald-600\">Personalized emails</span> notify users of promotions, demotions, and removals if they fail to meet the minimum required points, ensuring active participation.\n\nThe platform also includes a <span class=\"text-emerald-600\">resource hub</span> with <span class=\"text-emerald-600\">video tutorials and CP sheets</span>, providing valuable learning materials. The <span class=\"text-emerald-600\">gamified ranking system</span> keeps users engaged, making skill development more interactive.\n\nWith <span class=\"text-emerald-600\">real-time updates, performance tracking, and a strong coding community</span>, this platform helps users stay competitive and continuously improve. Whether you're a beginner or an experienced coder, it ensures you stay on top of your game. 🚀"
},
      "developers-contributors": {
        
          title: "Purpose of Website",
          content: "Our platform serves as the ultimate companion for competitive programmers seeking to elevate their core coding skills while also developing complementary abilities in design, video editing, and other digital domains. We've created a centralized ecosystem where programming progress becomes visible, achievement is recognized, and holistic growth is continuous through structured resources and community engagement.\n\n<ul class='space-y-2'><li><span class='text-emerald-600'>&#8226;</span> To create a <span class='text-emerald-600'>unified platform</span> that consolidates competitive programming profiles from multiple websites into one comprehensive dashboard.</li><li><span class='text-emerald-600'>&#8226;</span> To <span class='text-emerald-600'>motivate competitive programmers</span> through gamification, leaderboards, and healthy competition among peers.</li><li><span class='text-emerald-600'>&#8226;</span> To provide <span class='text-emerald-600'>comprehensive tracking</span> of coding activities and progress across various programming platforms.</li><li><span class='text-emerald-600'>&#8226;</span> To offer <span class='text-emerald-600'>specialized CP sheets, tutorials and resources</span> that help programmers improve not only their algorithmic skills but also complementary abilities in UI/UX design, video editing, and other professional domains.</li><li><span class='text-emerald-600'>&#8226;</span> To build a <span class='text-emerald-600'>supportive community</span> where competitive programmers can share techniques, celebrate achievements, and develop a well-rounded skillset beyond just coding.</li></ul>"
        
         },
    },
  },
  "tech-stack": {
    title: "Tech Stack",
    subsections: {
      "tech-stack-list": {
        title: "Technologies Used",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Phasellus gravida semper nisi.",
      },
      "packages-used": {
        title: "Libraries & Packages",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nulla, vitae euismod ligula urna in dolor.",
      },
    },
  },
  "join-us": {
    title: "Join us",
    subsections: {
      "register": {
        title: "Sign Up",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.",
      },
      "login": {
        title: "Login",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi.",
      },
      "forgot-password": {
        title: "Retrieve Password",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.",
      },
    },
  },
};

const NavigationMenu = ({ activeSection, handleNavigation, onClose }) => (
  <div className="h-full overflow-y-auto">
    {Object.entries(content).map(([key, section], index) => (
      <div key={key} className="mb-4">
        <div className="flex justify-between items-center">
          <h2
            className="text-lg md:text-xl font-semibold text-emerald-600 cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={() => handleNavigation(key)}
          >
            {section.title}
          </h2>

          {index === 0 && (
            <RotatingCloseButton className="md:hidden" onClick={onClose} />
          )}
        </div>
        {activeSection === key && (
          <ul className="space-y-2 mt-2 ml-4">
            {Object.entries(section.subsections).map(([subKey, sub]) => (
              <li
                key={subKey}
                className="text-xs sm:text-sm text-gray-600 cursor-pointer"
                onClick={() => handleNavigation(key, subKey)}
              >
                {sub.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

const UserManual = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("getting-started");
  const [currentSection, setCurrentSection] = useState("getting-started");
  const [activeSubsection, setActiveSubsection] = useState(null);

  useEffect(() => {
    setActiveSection("getting-started");
    
    if (content[currentSection]) {
      setActiveSection(currentSection);
    } else {
      setCurrentSection("getting-started");
    }
  }, []);

  const handleNavigation = (section, subsection = null) => {
    if (section === activeSection && !subsection) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
    
    setCurrentSection(section);
  
    
    setIsMenuOpen(false); 
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar");
      if (
        isMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !event.target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

 
    document.addEventListener("mousedown", handleClickOutside);

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <nav className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200 px-4 md:px-8 sticky top-0 bg-white z-30 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black transition-all">
            User Manual
          </h1>
        </div>
        <button
          className="md:hidden p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 menu-button transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </nav>

      <div className="flex flex-1 relative overflow-hidden">

        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleCloseMenu}
          aria-hidden="true"
        />

        <div
          id="mobile-sidebar"
          className={`fixed md:hidden top-0 left-0 h-full w-3/4 max-w-xs bg-white transform transition-transform duration-300 ease-in-out z-50 shadow-xl ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="p-4 h-full overflow-y-auto">
            <NavigationMenu
              activeSection={activeSection}
              handleNavigation={handleNavigation}
              onClose={handleCloseMenu}
            />
          </div>
        </div>

        <aside className="hidden md:block w-1/4 lg:w-1/5 xl:w-1/6 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-4 h-full overflow-y-auto sticky top-0">
            <NavigationMenu
              activeSection={activeSection}
              handleNavigation={handleNavigation}
            />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-600 transition-all">
              {content[currentSection]?.title || "Section Not Found"}
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(content[currentSection]?.subsections || {}).map(
              ([subKey, sub]) => (
                <div
                  key={subKey}
                  id={subKey}
                  className={`bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${
                    activeSubsection === subKey ? "ring-2 ring-emerald-300" : ""
                  }`}
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-600 mb-2 transition-all">
                    {sub.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {sub.content}
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManual;