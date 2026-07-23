import { useState } from "react";
import api from "../api";

export default function AddLevelForm() {
  const [form, setForm] = useState({
    level_no: "",
    title: "",
    description: "",
    difficulty: "Easy",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/levels", form);
    alert("✅ Question added");
    setForm({ level_no: "", title: "", description: "", difficulty: "Easy" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Question (Level)</h3>

      <input name="level_no" placeholder="Level No" onChange={handleChange} />
      <input name="title" placeholder="Title" onChange={handleChange} />
      <textarea name="description" placeholder="Question" onChange={handleChange} />

      <select name="difficulty" onChange={handleChange}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <button>Add Question</button>
    </form>
  );
}
