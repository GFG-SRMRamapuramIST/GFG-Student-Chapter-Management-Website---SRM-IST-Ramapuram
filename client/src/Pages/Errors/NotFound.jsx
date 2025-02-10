import DinoImage from "/src/Assets/icons/gfgDino.png";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-3xl w-full">
        <img 
          src={DinoImage} 
          alt="Cute dinosaur" 
          className="w-[500px] h-[300px] mx-auto my-6" 
        />
        
        <p className="text-gray-800 text-lg md:text-xl mb-8">
          "Oh, it's you again... 😉"
          <br />
          Why are you back here? Shoo shoo, go fix it already!
        </p>
        
        <a 
          href="/" 
          className=" bg-gfgsc-green text-white px-6 py-3 rounded inline-block text-base"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
