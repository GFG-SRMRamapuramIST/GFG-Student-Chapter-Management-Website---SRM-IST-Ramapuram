import React, { useState } from 'react';
import {FaTimes } from 'react-icons/fa';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-white text-black shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl md:text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const ReportAnIssue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [screenshotName, setScreenshotName] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    category: '',
    priority: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setScreenshotName(e.target.files[0].name);
      setFileInput(e.target);
    } else {
      setScreenshotName('');
      setFileInput(null);
    }
  };
  const [wordCount, setWordCount] = useState(0);


  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'description') {
      const words = value.trim().split(/\s+/);
      const count = words[0] === '' ? 0 : words.length;
  
      if (count <= 200) {
        setWordCount(count);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const removeFile = () => {
    if (fileInput) {
      fileInput.value = '';
      setScreenshotName('');
      setFileInput(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(formData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-lg md:text-xl">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center text-red-500 text-base md:text-lg">
                Error in loading the form! Please try again later
              </div>
            ) : (
              <div>
                <h2 className="text-gray-700 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-3 text-center">
                  Issue Report Form
                </h2>
                <p className="text-center mb-7 text-sm md:text-base">
                  Fill this form to report an issue. We will review your submission and get back to you soon!
                </p>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="flex flex-wrap -mx-2">
                    <div className="mb-3 w-full md:w-1/2 px-2">
                      <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
                        Name <span className="text-red-500 ml-1 text-xs">*</span>
                      </label>
                      <input
                        className="w-full border rounded-md p-2 text-black text-sm md:text-base"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        onChange={handleChange}
                        value={formData.name}
                        required
                      />
                    </div>

                    <div className="mb-3 w-full md:w-1/2 px-2">
                      <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
                        Email <span className="text-red-500 ml-1 text-xs">*</span>
                      </label>
                      <input
                        className="w-full border rounded-md p-2 text-black text-sm md:text-base"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                      />
                    </div>

                    <div className="mb-3 w-full px-2">
                      <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
                        Subject <span className="text-red-500 ml-1 text-xs">*</span>
                      </label>
                      <input
                        className="w-full border rounded-md p-2 text-black text-sm md:text-base"
                        name="subject"
                        type="text"
                        placeholder="Brief subject of the issue"
                        onChange={handleChange}
                        value={formData.subject}
                        required
                      />
                    </div>
                    <div className="mb-3 w-full px-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
                          Description <span className="text-red-500 ml-1 text-xs">*</span>
                        </label>
                        <span className={cn(
                          "text-xs text-gray-500",
                          wordCount >= 180 && "text-orange-500",
                          wordCount === 200 && "text-red-500"
                        )}>
                          {wordCount}/200 words
                        </span>
                      </div>
                      <textarea
                        className="w-full border rounded-md p-2 text-black text-sm md:text-base min-h-[120px] resize-y"
                        name="description"
                        placeholder="Describe your issue in detail (max 200 words)"
                        onChange={handleDescriptionChange}
                        value={formData.description}
                        required
                      />
                    </div>

                    <div className="mb-3 w-full px-2">
                      <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center">
                        Screenshot of the issue encountered<span className="text-gray-500 ml-2 text-xs"></span>
                      </label>
                      <div className="mt-1 flex items-center">
                        <label className="block">
                          <span className="sr-only">Choose screenshot</span>
                          <input
                            type="file"
                            className="block w-full text-xs md:text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-xs md:file:text-sm file:font-semibold
                              file:bg-emerald-50 file:text-emerald-700
                              hover:file:bg-emerald-100
                              cursor-pointer"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {screenshotName && (
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-xs md:text-sm text-gray-500">
                            Selected file: {screenshotName}
                          </p>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                           <FaTimes size={16} />
                          </button>
                        </div>
                      )}
                      <p className="mt-1 text-xs md:text-sm text-gray-500">
                        Upload a screenshot of the issue (PNG, JPG up to 5MB)
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm md:text-base",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {loading ? "Submitting..." : "Submit Issue"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Guide Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-600">Page Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-xs md:text-sm space-y-4 text-black">
                <div>
                 <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae voluptatem consequuntur quas ratione reiciendis assumenda minima, impedit accusantium distinctio, nulla delectus magnam odio quam sapiente in dolorum sint ullam libero!</p>
                
                 <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae voluptatem consequuntur quas ratione reiciendis assumenda minima, impedit accusantium distinctio, nulla delectus magnam odio quam sapiente in dolorum sint ullam libero!</p>
                 </div>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnIssue;