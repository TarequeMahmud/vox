"use client";
import axios from "axios";

export default function Register() {
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent form submission from reloading the page
    event.preventDefault();

    // Extract form data
    const formData = new FormData(event.currentTarget);
    const { name, username, email, password, phone, terms } =
      Object.fromEntries(formData.entries());

    // Validate form inputs
    if (!name || !username || !email || !password || !phone || !terms) {
      alert("Please fill in all fields and agree to the terms and conditions.");
      return;
    }

    try {
      // Send registration data to the server
      const response = await axios.post("/api/auth/register", {
        name,
        username,
        email,
        password,
        phone,
      });

      // Handle successful registration
      if (response.status === 201) {
        alert("Registration successful!");
        window.location.href = "/login";
      }
    } catch (error) {
      // Handle errors
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-[60%] h-full px-10  ">
      {/* register container */}
      <div className="flex flex-col justify-center items-center w-[600px] h-auto px-10 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg pb-4 my-6">
        <h1 className="text-3xl font-bold mt-4">Register</h1>
        <form
          className="flex flex-col justify-center gap-4 items-center w-full h-full "
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            required
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            minLength={6}
            maxLength={20}
            autoComplete="on"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            required
            pattern="[0-9]{15}"
            className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2 m-2"
          />
          <div className="flex items-center w-full m-2">
            <input type="checkbox" name="terms" required className="mr-2" />
            <label htmlFor="terms" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full h-[50px] bg-[#0000ff] text-white rounded-md m-4 cursor-pointer hover:bg-[#0000ffb3] transition duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
