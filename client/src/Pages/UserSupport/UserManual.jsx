import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaLightbulb,
  FaCode,
  FaUserCircle,
  FaChartLine,
  FaTrophy,
  FaBook,
  FaQuestion,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

// Content for the user manual
const content = {
  "getting-started": {
    title: "Getting Started",
    icon: <FaLightbulb className="text-gfgsc-green text-xl" />,
    subsections: {
      "about-website": {
        title: "About Us",
        content:
          "The GeeksforGeeks Student Chapter at SRMIST is a dynamic community bridging academic knowledge with industry demands. We empower students with technical expertise and problem-solving abilities essential in today's rapidly evolving tech landscape. Our focus on Competitive Programming sharpens analytical thinking, improves coding efficiency, and prepares students for both contests and technical interviews. Through our structured approach to Data Structures and Algorithms (DSA), we break down complex concepts into simplified, intuitive applications that students can easily grasp and implement.",
      },
      "website-overview": {
        title: "Website Overview",
        content:
          "Our platform serves as a <span class='text-emerald-600 font-medium'>comprehensive coding profile tracker</span> designed specifically for competitive programmers. We integrate profiles from multiple platforms, visualize coding activity through an interactive <span class='text-emerald-600 font-medium'>heatmap</span>, and enable effortless progress tracking.\n\nOur <span class='text-emerald-600 font-medium'>dynamic leaderboard</span> creates friendly competition within your circle, allowing side-by-side profile comparisons to keep motivation high. <span class='text-emerald-600 font-medium'>Personalized notifications</span> alert you about rank changes and requirements, ensuring active participation.\n\nThe platform includes a <span class='text-emerald-600 font-medium'>resource hub</span> with <span class='text-emerald-600 font-medium'>video tutorials and CP sheets</span> for continued learning. Our <span class='text-emerald-600 font-medium'>gamified ranking system</span> makes skill development engaging and interactive.\n\nWith <span class='text-emerald-600 font-medium'>real-time updates, comprehensive tracking, and community support</span>, we help you stay competitive and continuously improve your skills. From beginners to experienced coders, our platform ensures you're always at the top of your game. 🚀",
      },
      purpose: {
        title: "Our Purpose",
        content:
          "Our platform is the ultimate companion for competitive programmers looking to enhance their core coding skills while developing complementary abilities in design, video editing, and other digital domains. We've created a centralized ecosystem where programming progress becomes visible, achievements are recognized, and growth is continuous through structured resources and community engagement.\n\n<ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Unified Platform:</span> Consolidating competitive programming profiles from multiple websites into one comprehensive dashboard.</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>Motivation:</span> Driving competitive programmers through gamification, leaderboards, and healthy peer competition.</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>Comprehensive Tracking:</span> Monitoring coding activities and progress across various programming platforms.</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Specialized Resources:</span> Offering CP sheets, tutorials and resources that enhance algorithmic skills alongside UI/UX design, video editing, and other professional domains.</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>5</span><span class='text-emerald-600 font-medium'>Supportive Community:</span> Building an environment where programmers share techniques, celebrate achievements, and develop well-rounded skillsets.</li></ul>",
      },
    },
  },
  "tech-stack": {
    title: "Technology Stack",
    icon: <FaCode className="text-gfgsc-green text-xl" />,
    subsections: {
      "frontend": {
        title: "Frontend Technologies",
        content: "Our application leverages modern frontend technologies to deliver a seamless and responsive user experience:<ul class='space-y-2 list-disc pl-5 mt-3'><li><span class='text-emerald-600 font-medium'>React</span>: Powers our dynamic, component-based user interface with efficient rendering and state management</li><li><span class='text-emerald-600 font-medium'>Tailwind CSS</span>: Provides utility-first styling for rapid UI development with consistent design patterns</li><li><span class='text-emerald-600 font-medium'>Redux</span>: Manages application state centrally, enabling predictable data flow and simplified debugging</li><li><span class='text-emerald-600 font-medium'>Framer Motion</span>: Delivers fluid animations and transitions for an engaging user experience</li></ul>"
      },
      "backend": {
        title: "Backend Infrastructure",
        content: "Our robust backend architecture ensures data integrity, security, and scalable performance:<ul class='space-y-2 list-disc pl-5 mt-3'><li><span class='text-emerald-600 font-medium'>Express.js</span>: A lightweight Node.js framework that powers our RESTful API endpoints with middleware support</li><li><span class='text-emerald-600 font-medium'>MongoDB</span>: NoSQL database providing flexible data schema for efficient storage and retrieval of user profiles and activity metrics</li><li><span class='text-emerald-600 font-medium'>Python</span>: Powers specialized API integrations and data processing pipelines for platform connectivity</li></ul>"
      },
      "packages": {
        title: "Key Packages & Integrations",
        content: "We utilize carefully selected packages to enhance platform functionality:<ul class='space-y-2 list-disc pl-5 mt-3'><li><span class='text-emerald-600 font-medium'>Nodemailer</span>: Handles all transactional emails including verification codes, password resets, and important announcements</li><li><span class='text-emerald-600 font-medium'>Multer & Cloudinary</span>: Manage secure image uploads with cloud storage, generating optimized public links for profile pictures</li><li><span class='text-emerald-600 font-medium'>CORS</span>: Enables secure cross-origin requests with proper security headers</li><li><span class='text-emerald-600 font-medium'>Node-cron</span>: Powers scheduled tasks including leaderboard updates, notifications, and automated ranking calculations</li></ul>"
      }
    }
  },
  "join-us": {
    title: "Join Our Platform",
    icon: <FaUserCircle className="text-gfgsc-green text-xl" />,
    subsections: {
      "registration": {
        title: "Registration Process",
        content: "Creating your account is simple and secure:<ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Initial Form</span>: Provide your email, create a password (8+ characters with mixed case and numbers), and complete your basic profile details</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>Email Verification</span>: A verification OTP is sent to your email that remains valid until you complete registration</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>Coding Profiles</span>: Link your coding platform handles (e.g., LeetCode, GeeksforGeeks, CodeChef) to enable tracking and scoring</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Complete Registration</span>: Submit your details to finalize account creation</li></ul><p class='mt-3'>💡 <span class='italic'>Note: Each platform username will require verification before points can be earned and tracked.</span></p>"
      },
      "login": {
        title: "Login System",
        content: "Access your account securely with our login system:<ul class='space-y-2 list-disc pl-5 mt-3'><li>Enter your registered <span class='text-emerald-600 font-medium'>email address</span> and <span class='text-emerald-600 font-medium'>password</span></li><li>If your account doesn't exist, you'll see <span class='text-red-500 font-medium'>\"User not found!\"</span></li><li>If your password is incorrect, you'll receive <span class='text-red-500 font-medium'>\"Invalid password!\"</span></li><li>Upon successful authentication, you'll see <span class='text-emerald-600 font-medium'>\"Login successful!\"</span> and be directed to your dashboard</li></ul><p class='mt-3'>We employ industry-standard encryption and security practices to protect your login credentials. For additional security, sessions automatically expire after periods of inactivity.</p>"
      },
      "forgot-password": {
        title: "Password Recovery",
        content: "Reset your password easily with these steps:<ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Initiate Reset</span>: Click \"Forgot Password\" on the login page and enter your registered email</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>OTP Verification</span>: Check your email for a 6-digit OTP that expires after 10 minutes</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>New Password</span>: Create a secure password that meets our requirements</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Confirmation</span>: Your password is updated immediately and you can log in with your new credentials</li></ul><p class='mt-3'>For security reasons, you'll receive an email notification confirming that your password was changed.</p>"
      }
    }
  },
  "profile-management": {
    title: "Profile Management",
    icon: <FaUserCircle className="text-gfgsc-green text-xl" />,
    subsections: {
      "my-profile": {
        title: "My Profile Overview",
        content: "<p>Your profile dashboard provides a comprehensive view of your coding journey:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li><span class='text-emerald-600 font-medium'>Points Summary</span>: View your total accumulated points and monthly contributions</li><li><span class='text-emerald-600 font-medium'>Individual Platform Points</span>: Breakdown of points earned across each connected coding platform</li><li><span class='text-emerald-600 font-medium'>Rank History</span>: Track your current and previous rankings within the community</li><li><span class='text-emerald-600 font-medium'>Platform Activity</span>: Visual representation of your coding frequency and consistency</li><li><span class='text-emerald-600 font-medium'>Heat Map</span>: Calendar visualization showing your activity patterns and streaks</li><li><span class='text-emerald-600 font-medium'>Achievements</span>: Digital badges earned for milestones such as 7-day streaks, solving 50 problems, or reaching platform-specific ratings</li></ul><p class='mt-3 text-amber-600 font-medium'>⚠️ Important: You must verify your platform profiles to accumulate points and earn achievements. Unverified profiles won't contribute to your ranking or unlock special features.</p>"
      },
      "edit-profile": {
        title: "Edit Profile Settings",
        content: "<p>Maintain your profile information and settings with these options:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li><span class='text-emerald-600 font-medium'>Personal Information</span>: Update your name, contact details, and bio</li><li><span class='text-emerald-600 font-medium'>Profile Picture</span>: Upload a personal image (max 2MB, formats: JPG, PNG) that represents you on leaderboards and discussions</li><li><span class='text-emerald-600 font-medium'>Platform Usernames</span>: Connect or modify your coding platform handles</li><li><span class='text-emerald-600 font-medium'>Change Password</span>: Update your password regularly for enhanced security</li></ul><p class='mt-3 text-amber-600'>Note: When you update a platform username, you'll need to re-verify this profile before it resumes contributing to your points and rankings.</p>"
      },
      "compare-profile": {
        title: "Profile Comparison Tool",
        content: "<p>Our comparison feature offers powerful insights to benchmark your progress:</p><p class='mt-3'>This tool enables direct side-by-side comparison of coding metrics, helping you identify areas for growth and recognize your strengths. As a regular user, you can compare your profile with any other member while the first selection remains fixed to your profile.</p><p class='mt-3'>Core members and administrators have expanded capabilities to compare any two members for mentorship and guidance purposes.</p><p class='mt-3'>Key comparison metrics include:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Problem-solving frequency and consistency</li><li>Platform-specific ratings and rankings</li><li>Growth trajectory and improvement patterns</li><li>Strengths across problem categories and difficulty levels</li></ul><p class='mt-3'>Use this feature to set realistic goals based on peer performance and identify successful strategies you might adopt in your learning journey.</p>"
      }
    }
  },
  "dashboard-features": {
    title: "Dashboard Features",
    icon: <FaChartLine className="text-gfgsc-green text-xl" />,
    subsections: {
      "pod": {
        title: "POTD",
        content: "<p>Stay consistent with daily coding challenges:</p><p class='mt-3'>Our Problem of the Day (POD) section aggregates daily challenges from LeetCode and GeeksforGeeks into a convenient single view. These are the only platforms currently factored into our points calculation for practice questions.</p><p class='mt-3'>Each featured problem includes:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Difficulty level indicator</li><li>Topic tags for skill targeting</li><li>Direct solve links to the respective platforms</li><li>Community discussion threads</li></ul><p class='mt-3'>Solving these daily problems contributes to your platform activity streak and point accumulation. We recommend attempting at least one problem daily to maintain consistent progress in your coding journey.</p>"
      },
      "notifications": {
        title: "Notifications",
        content: "<p>Stay informed with our flexible notification system:</p><p class='mt-3'>Control your notification preferences using the toggle switch in the top-right corner of your dashboard. When enabled, you'll receive updates about:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Rank changes and movements on the leaderboard</li><li>New events and meetings added to the calendar</li><li>Achievement unlocks and milestone completions</li><li>Platform verification status changes</li><li>Monthly point calculations and rank updates</li></ul><p class='mt-3 text-amber-600'>Note: On the 1st of each month, we automatically reset all notification preferences to 'enabled' to ensure you don't miss important monthly updates and requirements.</p><p class='mt-3'>While regular notifications can be disabled, critical announcements will still be delivered to your registered email address.</p>"
      },
      "top-performers": {
        title: "Performance Metrics",
        content: "<p>Track excellence within our community:</p><p class='mt-3'>Your dashboard highlights the top 5 performers of the current month, showcasing members who demonstrate exceptional activity and problem-solving skills. This feature promotes healthy competition and recognition of outstanding contributors.</p><p class='mt-3'>The performance display includes:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Member name and profile picture</li><li>Current month's point accumulation</li><li>Platform activity metrics</li><li>Rank movement indicator (improved, maintained, or declined)</li></ul><p class='mt-3'>Your personal performance metrics are also prominently displayed, showing your current points, rank, previous rank, and progress toward the next ranking tier. Use these insights to set personal goals and track your development within the community.</p>"
      },
      "calendar": {
        title: "Calendar & Notice Board",
        content: "<p>Never miss important events and announcements:</p><p class='mt-3'>Our interactive calendar system helps you stay organized with upcoming activities:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Scheduled coding contests across multiple platforms</li><li>Chapter meetings and collaborative sessions</li><li>Workshop announcements and registration deadlines</li><li>Important academic dates and opportunities</li></ul><p class='mt-3'>When notification preferences are enabled, you'll receive timely alerts about new calendar additions. Core members and administrators can schedule events and contests directly through the platform.</p><p class='mt-3'>After each meeting, Minutes of Meeting (MOM) documents are uploaded to the calendar entry, ensuring you can catch up on important discussions even if you couldn't attend in person.</p>"
      },
      "announcements": {
        title: "Critical Announcements",
        content: "<p>Stay informed about vital chapter updates:</p><p class='mt-3'>The Announcements section is reserved for high-priority communications that affect all chapter members. These announcements are distinguished from regular notifications by their importance and visibility.</p><p class='mt-3'>Key characteristics of announcements include:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Email delivery regardless of notification preferences</li><li>Persistent display at the top of your dashboard</li><li>Visual indicators of urgency and importance</li><li>Acknowledgment tracking for critical updates</li></ul><p class='mt-3'>Only core team members and administrators can create or remove announcements, ensuring this channel remains focused on truly essential information.</p>"
      }
    }
  },
  "leaderboard": {
    title: "Leaderboard System",
    icon: <FaTrophy className="text-gfgsc-green text-xl" />,
    subsections: {
      "overview": {
        title: "Leaderboard Overview",
        content: "<p>Monitor performance and foster healthy competition:</p><p class='mt-3'>Our comprehensive leaderboard system visually represents member performance and contribution levels within the chapter. The top three performers are prominently featured with special recognition at the top of the board.</p><p class='mt-3'>Leaderboard highlights include:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Real-time ranking based on accumulated points across platforms</li><li>Visual distinction between different membership tiers</li><li>Performance trend indicators showing movement since previous rankings</li><li>Color-coding to indicate members below minimum participation thresholds (highlighted in red)</li><li>Detailed point breakdown on hover or selection</li></ul><p class='mt-3'>Regular engagement with the leaderboard helps motivate consistent practice and create a positive competitive environment that drives collective growth.</p>"
      },
      "passing-criteria": {
        title: "Minimum Performance Requirements",
        content: "<p>Understanding our point-based advancement system:</p><p class='mt-3'>To maintain active membership and advance within our chapter, members must meet or exceed minimum performance requirements calculated using this formula:</p><div class='bg-gray-100 p-4 rounded-md my-4'><code class='text-sm font-mono'>Minimum Passing Score = (Total Days in Month ÷ 2) × 10</code></div><p>For example, in a 30-day month:</p><div class='bg-gray-100 p-4 rounded-md my-4'><code class='text-sm font-mono'>Minimum Passing Score = (30 ÷ 2) × 10 = 150 points</code></div><p class='mt-3'>Important policies regarding minimum requirements:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Members must achieve at least the exact minimum score (not below by even 1 point)</li><li>Those who fail to meet requirements are removed from active membership</li><li>Regular members who consistently meet requirements are eligible for promotion to core member status</li><li>New applicants meeting these criteria bypass the waiting list for faster admission</li></ul><p class='mt-3'>This system ensures that our community remains active, engaged, and committed to continuous improvement.</p>"
      }
    }
  },
  "resources": {
    title: "Learning Resources",
    icon: <FaBook className="text-gfgsc-green text-xl" />,
    subsections: {
      "overview": {
        title: "Resources Hub",
        content: "<p>Access curated learning materials for continuous improvement:</p><p class='mt-3'>Our Resources section serves as a centralized knowledge repository designed to supplement your coding practice with structured learning materials. We've carefully curated content that aligns with industry standards and interview requirements.</p><p class='mt-3'>The Resources hub provides:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Topic-specific tutorials and guides</li><li>Video lectures from experienced practitioners</li><li>Downloadable cheat sheets and quick references</li><li>Interview preparation materials</li><li>Recommended reading lists and external resources</li></ul><p class='mt-3'>Regularly exploring these resources alongside your daily coding practice creates a balanced approach to skill development, combining theoretical knowledge with practical application.</p>"
      },
      "functionality": {
        title: "Using the Resources Section",
        content: "<p>Navigate and contribute to our knowledge base:</p><p class='mt-3'>Our resource library features intuitive navigation and contribution tools:</p><ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Search Functionality</span>: Quickly locate resources using keywords, topics, or tags</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>Resource Creation</span>: Core members and administrators can add new resources via the \"Create Resource\" button</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>Resource Details</span>: Click any resource to view full content, including descriptions, links, attachments, and related materials</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Interaction Options</span>: Save resources to favorites, share via link, report issues, or suggest improvements</li></ul><p class='mt-3'>We encourage all members to utilize these resources regularly and provide feedback to help us continuously improve our knowledge base.</p>"
      }
    }
  },
  "practice": {
    title: "Practice Section",
    icon: <FaCode className="text-gfgsc-green text-xl" />,
    subsections: {
      "overview": {
        title: "Practice Hub",
        content: "<p>Sharpen your skills with targeted problem sets:</p><p class='mt-3'>Our Practice section provides a structured approach to problem-solving across multiple difficulty levels and topic areas. Unlike random practice, our curated problem sets are designed to build specific skills and prepare you for technical interviews and competitive programming contests.</p><p class='mt-3'>Benefits of our practice system include:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Progressive skill development from fundamentals to advanced techniques</li><li>Focus on common interview patterns and algorithms</li><li>Varied problem styles to build versatile problem-solving approaches</li><li>Consistent tracking of attempted problems and success rates</li></ul><p class='mt-3'>Regular engagement with these practice problems complements your daily coding routine and accelerates your growth as a programmer.</p>"
      },
      "functionality": {
        title: "Using the Practice Section",
        content: "<p>Customize your practice experience:</p><p class='mt-3'>Our practice area features powerful filtering and organization tools to help you focus on specific areas of improvement:</p><ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Difficulty Filters</span>: Sort problems by Easy, Medium, or Hard categories to match your current skill level</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>Platform Selection</span>: Filter questions based on LeetCode, GeeksforGeeks, CodeChef, or other supported platforms</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>Topic Filters</span>: Focus on specific algorithms, data structures, or interview topics</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Search Function</span>: Locate specific problems or related problem sets</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>5</span><span class='text-emerald-600 font-medium'>Problem Details</span>: View solution approaches, time/space complexity requirements, and related concepts</li></ul><p class='mt-3'>Core members can contribute to our practice database by adding new problems and organizing themed problem sets for the community.</p>"
      }
    }
  },
  "user-support": {
    title: "User Support",
    icon: <FaQuestion className="text-gfgsc-green text-xl" />,
    subsections: {
      "report-issue": {
        title: "Report an Issue",
        content: "<p>Help us improve by reporting technical problems:</p><p class='mt-3'>Our issue reporting system allows you to quickly notify the development team about any platform functionality problems you encounter:</p><ul class='space-y-3 list-none ml-0 mt-3'><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>1</span><span class='text-emerald-600 font-medium'>Troubleshooting First</span>: Before reporting, please refresh your browser and attempt the action again, as this resolves many temporary issues</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>2</span><span class='text-emerald-600 font-medium'>Issue Description</span>: Provide detailed information about what you were trying to do, what happened, and what you expected to happen</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>3</span><span class='text-emerald-600 font-medium'>Submission Tracking</span>: Each report receives a unique reference ID for follow-up</li><li><span class='inline-flex items-center justify-center w-6 h-6 mr-2 text-emerald-600 bg-emerald-100 rounded-full'>4</span><span class='text-emerald-600 font-medium'>Resolution Updates</span>: You'll receive notifications as your reported issue progresses through our fix pipeline</li></ul><p class='mt-3'>Your feedback is invaluable in helping us maintain a stable and effective platform for the entire community.</p>"
      },
      "terms": {
        title: "Terms & Conditions",
        content: "<p>Understand our platform policies and guidelines:</p><p class='mt-3'>Our Terms & Conditions document outlines the rights and responsibilities of all platform users. We encourage all members to carefully review this document to ensure compliance with our community standards and technical policies.</p><p class='mt-3'>Key areas covered in our terms include:</p><ul class='space-y-2 list-disc pl-5 mt-3'><li>Member code of conduct and ethical guidelines</li><li>Data privacy and information handling practices</li><li>Intellectual property rights for contributed content</li><li>Account security responsibilities</li><li>Platform usage limitations and restrictions</li></ul><p class='mt-3'>The complete Terms & Conditions document is regularly updated to reflect changes in our features and compliance requirements. By continuing to use the platform, you acknowledge and agree to abide by these terms.</p>"
      }
    }
  }
};

export default function UserManual() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeSubsection, setActiveSubsection] = useState("about-website");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);

  // Memoize content to prevent unnecessary re-renders
  const currentContent = useMemo(() => {
    return content[activeSection]?.subsections[activeSubsection];
  }, [activeSection, activeSubsection]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeSection, activeSubsection]);

  useEffect(() => {
    if (content[activeSection]) {
      const defaultSubsection = Object.keys(content[activeSection].subsections)[0];
      setActiveSubsection(defaultSubsection);
    }
    // Scroll to top when section changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  if (!currentContent) return null;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8" ref={contentRef}>
      <div className=" mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gfgsc-green">User Manual</h1>
          <p className="mt-2 text-gray-600">Everything you need to know about using our platform</p>
        </div>

        {/* Mobile Section Selector Dropdown */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex justify-between items-center p-3 bg-white rounded-lg shadow-sm text-emerald-700 border border-emerald-100"
          >
            <div className="flex items-center">
              {content[activeSection].icon}
              <span className="ml-3 font-medium">{content[activeSection].title}</span>
            </div>
            {mobileMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-2">
                  {Object.entries(content).map(([section, { title, icon }]) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center p-3 text-left rounded-lg mb-1 transition-all duration-200 ${
                        activeSection === section
                          ? "bg-emerald-100 text-emerald-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="mr-3 text-xl">{icon}</span>
                      <span className="font-medium">{title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <nav className="space-y-1">
                {Object.entries(content).map(([section, { title, icon }]) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center p-3 text-left rounded-lg transition-all duration-200 ${
                      activeSection === section
                        ? "bg-emerald-100 text-emerald-700 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="mr-3 text-xl">{icon}</span>
                    <span className="font-medium">{title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Active Section Header */}
            <motion.div
              className="hidden md:flex bg-white rounded-xl shadow-md mb-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={activeSection}
            >
              <div className="text-gfgsc-green p-4 sm:p-6 flex items-center">
                {content[activeSection].icon}
                <h2 className="ml-3 text-xl font-bold">{content[activeSection].title}</h2>
              </div>
            </motion.div>

            {/* Subsection Navigation - Horizontal Scrollable on Mobile */}
            <div className="bg-white rounded-xl shadow-sm p-3 mb-4 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {Object.entries(content[activeSection].subsections).map(
                  ([subsection, { title }]) => (
                    <button
                      key={subsection}
                      onClick={() => setActiveSubsection(subsection)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                        activeSubsection === subsection
                          ? "bg-emerald-100 text-emerald-700 font-medium shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {title}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Content Display */}
            <motion.div
              className="bg-white rounded-xl shadow-sm"
              key={`${activeSection}-${activeSubsection}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gfgsc-green"></div>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl font-bold text-emerald-700 mb-6">
                    {currentContent.title}
                  </h3>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: currentContent.content,
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  
  );
}
