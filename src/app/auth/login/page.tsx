"use client";
import axios from "axios";

export default function Login() {
  const handleSignin = (event: React.FormEvent<HTMLFormElement>) => {
    //prevent reload
    event.preventDefault();

    //form inputs
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(email, password);

    // Perform validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    axios
      .post("/api/auth/login", { email, password })
      .then((response) => {
        console.log(response);

        console.log(response.data);
        if (response.status === 200) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <div className="flex flex-col justify-center items-center w-[50%] h-full px-10  ">
      {/* login container */}
      <div className="flex flex-col justify-center items-center w-[500px] h-[400px] px-10 bg-[#ffffffe1] rounded-xl border-2 border-gray-300 shadow-lg">
        <h1 className="text-3xl font-bold mt-4">Login</h1>
        <form
          className="flex flex-col justify-center gap-4 items-center w-full h-full"
          onSubmit={handleSignin}
        >
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
          <button
            type="submit"
            className="w-full h-[50px] bg-[#0000ff] text-white rounded-md m-2 cursor-pointer hover:bg-[#0000ffb3] transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
