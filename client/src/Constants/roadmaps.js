const competitiveProgrammingRoadmap = {
    title: "Competitive Programming",
    slug: "competitive",
    nodes: [
        {
            id: "intro",
            title: "Getting Started",
            level: "Beginner",
            description: "Learn the basics of competitive programming, including problem-solving techniques and coding platforms.",
            resources: [
                { name: "Introduction to Competitive Programming", link: "https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/" },
                { name: "Codeforces Guide", link: "https://codeforces.com/" },
                { name: "HackerRank Tutorials", link: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" }
            ],
            next: ["math", "recursion"]
        },
        {
            id: "math",
            title: "Math & Number Theory",
            level: "Beginner",
            description: "Understand the mathematical foundations required for solving competitive programming problems.",
            resources: [
                { name: "Number Theory Basics", link: "https://www.geeksforgeeks.org/number-theory-basics/" },
                { name: "Modular Arithmetic", link: "https://www.geeksforgeeks.org/modular-arithmetic-properties-applications/" }
            ],
            next: ["prefixsum"]
        },
        {
            id: "recursion",
            title: "Recursion",
            level: "Beginner",
            description: "Learn how to solve problems using recursion and understand its applications.",
            resources: [
                { name: "Recursion Basics", link: "https://www.geeksforgeeks.org/recursion/" },
                { name: "Backtracking Problems", link: "https://www.geeksforgeeks.org/backtracking-algorithms/" }
            ],
            next: ["dp"]
        },
        {
            id: "prefixsum",
            title: "Prefix Sum & Arrays",
            level: "Intermediate",
            description: "Master prefix sums and array manipulation techniques for efficient problem-solving.",
            resources: [
                { name: "Prefix Sum Basics", link: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/" },
                { name: "Sliding Window Technique", link: "https://www.geeksforgeeks.org/window-sliding-technique/" }
            ],
            next: ["graphs"]
        },
        {
            id: "dp",
            title: "Dynamic Programming",
            level: "Intermediate",
            description: "Learn dynamic programming techniques to solve complex problems efficiently.",
            resources: [
                { name: "Dynamic Programming Introduction", link: "https://www.geeksforgeeks.org/dynamic-programming/" },
                { name: "Top 20 DP Problems", link: "https://www.geeksforgeeks.org/top-20-dynamic-programming-interview-questions/" }
            ],
            next: ["graphs", "trees"]
        },
        {
            id: "graphs",
            title: "Graphs",
            level: "Advanced",
            description: "Explore graph algorithms like BFS, DFS, and shortest path algorithms.",
            resources: [
                { name: "Graph Basics", link: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
                { name: "Shortest Path Algorithms", link: "https://www.geeksforgeeks.org/shortest-path-in-a-weighted-graph/" }
            ],
            next: ["advancedgraphs"]
        },
        {
            id: "trees",
            title: "Trees",
            level: "Advanced",
            description: "Understand tree data structures and their applications in problem-solving.",
            resources: [
                { name: "Binary Trees", link: "https://www.geeksforgeeks.org/binary-tree-data-structure/" },
                { name: "Binary Search Trees", link: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/" }
            ],
            next: ["advancedtrees"]
        },
        {
            id: "advancedgraphs",
            title: "Advanced Graph Algorithms",
            level: "Expert",
            description: "Dive deeper into advanced graph algorithms like Minimum Spanning Tree and Network Flow.",
            resources: [
                { name: "Kruskal's Algorithm", link: "https://www.geeksforgeeks.org/kruskals-algorithm-simple-implementation-for-minimum-spanning-tree/" },
                { name: "Ford-Fulkerson Algorithm", link: "https://www.geeksforgeeks.org/ford-fulkerson-algorithm-for-maximum-flow-problem/" }
            ],
            next: []
        },
        {
            id: "advancedtrees",
            title: "Advanced Tree Algorithms",
            level: "Expert",
            description: "Learn advanced tree algorithms like Segment Trees and Fenwick Trees.",
            resources: [
                { name: "Segment Trees", link: "https://www.geeksforgeeks.org/segment-tree-set-1-range-minimum-query/" },
                { name: "Fenwick Trees", link: "https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/" }
            ],
            next: []
        }
    ]
};

const frontendRoadmap = {
    title: "Frontend Development",
    slug: "frontend",
    nodes: [
        {
            id: "htmlcss",
            title: "HTML & CSS Basics",
            level: "Beginner",
            description: "Learn the fundamental building blocks of web development: HTML for structure and CSS for styling.",
            resources: [
                { name: "MDN - HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics" },
                { name: "CSS Crash Course", link: "https://web.dev/learn/css/" },
                { name: "FreeCodeCamp HTML/CSS", link: "https://www.freecodecamp.org/learn/responsive-web-design/" }
            ],
            next: ["javascript", "responsive"]
        },
        {
            id: "responsive",
            title: "Responsive Design",
            level: "Beginner",
            description: "Learn how to create websites that work well on all devices and screen sizes.",
            resources: [
                { name: "Responsive Web Design", link: "https://web.dev/responsive-web-design-basics/" },
                { name: "CSS Flexbox Guide", link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
                { name: "CSS Grid Guide", link: "https://css-tricks.com/snippets/css/complete-guide-grid/" }
            ],
            next: ["cssframeworks"]
        },
        {
            id: "javascript",
            title: "JavaScript Fundamentals",
            level: "Beginner",
            description: "Master the basics of JavaScript, the programming language of the web.",
            resources: [
                { name: "JavaScript.info", link: "https://javascript.info/" },
                { name: "Eloquent JavaScript", link: "https://eloquentjavascript.net/" },
                { name: "MDN JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
            ],
            next: ["dom", "esmodules"]
        },
        {
            id: "dom",
            title: "DOM Manipulation",
            level: "Intermediate",
            description: "Learn how to interact with and modify HTML documents using JavaScript.",
            resources: [
                { name: "DOM Introduction", link: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" },
                { name: "JavaScript DOM Manipulation", link: "https://www.javascripttutorial.net/javascript-dom/" }
            ],
            next: ["fetchapi"]
        },
        {
            id: "cssframeworks",
            title: "CSS Frameworks",
            level: "Intermediate",
            description: "Explore popular CSS frameworks to speed up your development process.",
            resources: [
                { name: "Tailwind CSS", link: "https://tailwindcss.com/docs" },
                { name: "Bootstrap", link: "https://getbootstrap.com/docs/5.3/getting-started/introduction/" }
            ],
            next: ["reactjs"]
        },
        {
            id: "esmodules",
            title: "ES6+ & Modules",
            level: "Intermediate",
            description: "Learn modern JavaScript features and module systems.",
            resources: [
                { name: "ES6 Features", link: "https://www.tutorialspoint.com/es6/es6_overview.htm" },
                { name: "JavaScript Modules", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" }
            ],
            next: ["fetchapi"]
        },
        {
            id: "fetchapi",
            title: "Working with APIs",
            level: "Intermediate",
            description: "Learn how to fetch data from servers and work with APIs using JavaScript.",
            resources: [
                { name: "Fetch API", link: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
                { name: "Async/Await", link: "https://javascript.info/async-await" }
            ],
            next: ["reactjs"]
        },
        {
            id: "reactjs",
            title: "React.js",
            level: "Advanced",
            description: "Learn React, a popular JavaScript library for building user interfaces.",
            resources: [
                { name: "React Official Docs", link: "https://reactjs.org/docs/getting-started.html" },
                { name: "React Tutorial", link: "https://react.dev/learn" }
            ],
            next: ["statemanagement", "routing"]
        },
        {
            id: "statemanagement",
            title: "State Management",
            level: "Advanced",
            description: "Learn how to manage state in complex applications using libraries like Redux or Context API.",
            resources: [
                { name: "Redux Toolkit", link: "https://redux-toolkit.js.org/" },
                { name: "React Context API", link: "https://reactjs.org/docs/context.html" }
            ],
            next: ["typescript"]
        },
        {
            id: "routing",
            title: "Client-side Routing",
            level: "Advanced",
            description: "Implement navigation in single-page applications using React Router.",
            resources: [
                { name: "React Router", link: "https://reactrouter.com/en/main" },
                { name: "SPA Navigation Patterns", link: "https://web.dev/hands-on-portals/" }
            ],
            next: ["testing"]
        },
        {
            id: "typescript",
            title: "TypeScript",
            level: "Expert",
            description: "Add static typing to your JavaScript applications with TypeScript.",
            resources: [
                { name: "TypeScript Handbook", link: "https://www.typescriptlang.org/docs/handbook/intro.html" },
                { name: "TypeScript with React", link: "https://react-typescript-cheatsheet.netlify.app/" }
            ],
            next: ["nextjs"]
        },
        {
            id: "testing",
            title: "Frontend Testing",
            level: "Expert",
            description: "Learn how to test your frontend applications for reliability and quality.",
            resources: [
                { name: "Jest Testing Framework", link: "https://jestjs.io/docs/getting-started" },
                { name: "React Testing Library", link: "https://testing-library.com/docs/react-testing-library/intro/" }
            ],
            next: ["nextjs"]
        },
        {
            id: "nextjs",
            title: "Next.js & SSR",
            level: "Expert",
            description: "Explore server-side rendering and static site generation with Next.js.",
            resources: [
                { name: "Next.js Documentation", link: "https://nextjs.org/docs" },
                { name: "Server Components", link: "https://nextjs.org/docs/getting-started/react-essentials#server-components" }
            ],
            next: []
        }
    ]
};

const backendRoadmap = {
    title: "Backend Development",
    slug: "backend",
    nodes: [
        {
            id: "programming",
            title: "Programming Basics",
            level: "Beginner",
            description: "Choose a backend programming language and learn its fundamentals.",
            resources: [
                { name: "Node.js Documentation", link: "https://nodejs.org/en/docs" },
                { name: "Python Official Tutorial", link: "https://docs.python.org/3/tutorial/" },
                { name: "Java Tutorial", link: "https://dev.java/learn/" }
            ],
            next: ["cli", "databases"]
        },
        {
            id: "cli",
            title: "Command Line & Git",
            level: "Beginner",
            description: "Learn to navigate the command line and use Git for version control.",
            resources: [
                { name: "Command Line Crash Course", link: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line" },
                { name: "Git Handbook", link: "https://guides.github.com/introduction/git-handbook/" }
            ],
            next: ["webservers"]
        },
        {
            id: "databases",
            title: "Databases",
            level: "Beginner",
            description: "Learn about different types of databases and how to interact with them.",
            resources: [
                { name: "SQL Basics", link: "https://www.w3schools.com/sql/" },
                { name: "MongoDB Basics", link: "https://university.mongodb.com/courses/M001/about" }
            ],
            next: ["orm", "api"]
        },
        {
            id: "webservers",
            title: "Web Servers",
            level: "Intermediate",
            description: "Understand how web servers work and handle HTTP requests and responses.",
            resources: [
                { name: "HTTP Fundamentals", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP" },
                { name: "Express.js Guide", link: "https://expressjs.com/en/guide/routing.html" }
            ],
            next: ["api"]
        },
        {
            id: "api",
            title: "API Development",
            level: "Intermediate",
            description: "Learn how to build RESTful APIs and understand API design principles.",
            resources: [
                { name: "RESTful API Design", link: "https://restfulapi.net/" },
                { name: "Building APIs with Express", link: "https://expressjs.com/en/guide/routing.html" }
            ],
            next: ["auth"]
        },
        {
            id: "orm",
            title: "ORM & Database Design",
            level: "Intermediate",
            description: "Work with Object-Relational Mapping tools and learn database design principles.",
            resources: [
                { name: "Sequelize ORM", link: "https://sequelize.org/master/" },
                { name: "Database Normalization", link: "https://www.guru99.com/database-normalization.html" }
            ],
            next: ["auth", "caching"]
        },
        {
            id: "auth",
            title: "Authentication & Security",
            level: "Advanced",
            description: "Implement user authentication and learn security best practices.",
            resources: [
                { name: "JWT Authentication", link: "https://jwt.io/introduction" },
                { name: "OWASP Top 10", link: "https://owasp.org/www-project-top-ten/" }
            ],
            next: ["testing"]
        },
        {
            id: "caching",
            title: "Caching & Performance",
            level: "Advanced",
            description: "Optimize application performance using caching and other techniques.",
            resources: [
                { name: "Redis Documentation", link: "https://redis.io/documentation" },
                { name: "Web Performance", link: "https://web.dev/performance-auditing-with-lighthouse/" }
            ],
            next: ["microservices"]
        },
        {
            id: "testing",
            title: "Backend Testing",
            level: "Advanced",
            description: "Learn how to write unit tests, integration tests, and implement CI/CD pipelines.",
            resources: [
                { name: "Testing Node.js Applications", link: "https://nodejs.org/en/docs/guides/simple-profiling/" },
                { name: "CI/CD with GitHub Actions", link: "https://docs.github.com/en/actions" }
            ],
            next: ["microservices", "serverless"]
        },
        {
            id: "microservices",
            title: "Microservices",
            level: "Expert",
            description: "Understand microservices architecture and its implementation.",
            resources: [
                { name: "Microservices Guide", link: "https://martinfowler.com/microservices/" },
                { name: "Docker & Containerization", link: "https://docs.docker.com/get-started/" }
            ],
            next: ["messaging"]
        },
        {
            id: "serverless",
            title: "Serverless Architecture",
            level: "Expert",
            description: "Build applications using serverless computing platforms.",
            resources: [
                { name: "AWS Lambda", link: "https://aws.amazon.com/lambda/" },
                { name: "Serverless Framework", link: "https://www.serverless.com/framework/docs/" }
            ],
            next: ["messaging"]
        },
        {
            id: "messaging",
            title: "Message Queues & Event Streaming",
            level: "Expert",
            description: "Implement asynchronous communication with message queues and event streaming platforms.",
            resources: [
                { name: "RabbitMQ Tutorials", link: "https://www.rabbitmq.com/getstarted.html" },
                { name: "Apache Kafka", link: "https://kafka.apache.org/documentation/" }
            ],
            next: []
        }
    ]
};

// Function to fetch the appropriate roadmap by slug
const getRoadmapBySlug = (slug) => {
    switch (slug) {
        case "frontend":
            return frontendRoadmap;
        case "backend":
            return backendRoadmap;
        case "competitive":
        default:
            return competitiveProgrammingRoadmap;
    }
};

export default getRoadmapBySlug;
export { competitiveProgrammingRoadmap, frontendRoadmap, backendRoadmap };