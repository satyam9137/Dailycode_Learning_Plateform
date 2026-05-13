// import { useState } from "react";
// import axios from "axios";

// export default function AdminLogin() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });
//   const [msg, setMsg] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "https://dailycode-learning-plateform-4.onrender.com/api/admin/login",
//         form
//       );

//       localStorage.setItem("adminToken", res.data.token);
//       setMsg("✅ Login Successful");
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "100px auto" }}>
//       <h2>Admin Login</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <button type="submit">Login</button>
//       </form>

//       <p>{msg}</p>
//     </div>
//   );
// }
