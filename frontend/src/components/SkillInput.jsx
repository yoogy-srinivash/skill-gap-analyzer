import { useState } from "react";

export default function SkillInput({ skills, setSkills }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">Your current skills</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={addSkill}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm transition"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-blue-400 hover:text-white transition text-xs"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}