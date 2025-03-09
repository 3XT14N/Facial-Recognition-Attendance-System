const PersonalInfo = ({ formData, handleChange, errors }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder="example@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>
    );
  };
  
  export default PersonalInfo;
  