const RoleSelection = ({ role, setRole }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">I am a</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>
      </div>
    );
  };
  
  export default RoleSelection;
  