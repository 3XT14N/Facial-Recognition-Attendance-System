const Credentials = ({ formData, handleChange, errors }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Credentials</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder="********"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder="********"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    );
  };
  
  export default Credentials;
  