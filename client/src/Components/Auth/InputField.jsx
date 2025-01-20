const InputField = ({ icon, type, placeholder, value, onChange, name }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputField;
