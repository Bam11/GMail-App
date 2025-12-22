import React, { Suspense, useState } from 'react'
import supabase from "~/lib/supabase";
import { useAuth } from '~/auth/authContext';
import { useNavigate } from 'react-router';


export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [FormData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [errors, seterrors] = useState<Record<string, string>>({});
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      seterrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // /* if (!FormData.fullName.trim()) {
    //   newErrors.fullName = "Full name is required";
    // }

    if (mode === "signup") {
      if (!FormData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (FormData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
    }

    if (!FormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(FormData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!FormData.password) {
      newErrors.password = "Password is required";
    } else if (FormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    seterrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setisLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: FormData.email,
          password: FormData.password,
          options: {
            data: {
              fullName: FormData.fullName,
              username: FormData.username
            }
          }
        });
        // supabase.auth.updateUser({
        //   data: {
        //     fullName: FormData.fullName,
        //     username: FormData.username
        //   }
        // })

        if (signupError) {
          console.error(signupError.message);
          seterrors({ email: signupError.message });
          return;
        }

        // Upsert user profile in Supabase
        const { error: userError } = await supabase.from("user_profile").upsert({
          auth_user: user?.id,
          username: FormData.username,
          fullname: FormData.fullName,
        });

        if (userError) {
          throw userError;
        }

        // Update user metadata in Supabase
        const { error:updateError } = await supabase.auth.updateUser({
          data: {
            username: FormData.username,
            fullName: FormData.fullName,
          },
        });

        if (updateError) {
          throw updateError;
        }

        // Update local user state
        if (user) {
          const updatedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              username: FormData.username,
              fullName: FormData.fullName,
            },
          };
          setUser(updatedUser);
        }

        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: FormData.email,
          password: FormData.password
        });

        if (error) {
          console.error(error.message);
          seterrors({ email: error.message });
          return;
        }

        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-50 to-white">
        {/* <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="py-10 px-8 mx-2 bg-neutral-900 border border-neutral-700 rounded-md shadow-sm">
              <div className="grid place-items-center">
                <img
                  src="/images/insta-logo.png"
                  alt="Instagram Logo"
                  className="w-[200px]"
                />
              </div>
              <p className="text-white text-center mb-8 font-semibold max-w-xs">
                Sign up to see photos and videos from your friends.
              </p>
              <Suspense fallback={<div>Loading...</div>}>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "#3897f0",
                          brandAccent: "#3897f0",
                          inputText: "#ffffff",
                          inputBackground: "#1f1f1f",
                          inputBorder: "#333333",
                          messageText: "#ffffff"
                        },
                        fonts: {
                          bodyFontFamily: "Helvetica, Arial, sans-serif"
                        }
                      }
                    }
                  }}
                  providers={["google", "facebook"]}
                  redirectTo="/"
                />
              </Suspense>
            </div>
          </div>
        </div> */}
        <div className="max-w-4xl w-full mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col justify-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold bg-linear-to-r from-[#4285f4] via-[#c5221f] via-[#fbbc04] to-[#34a853] text-transparent bg-clip-text mb-4">
              G‑mail
            </h1>
            <p className="text-gray-600">
              Sign in to access your mailbox and manage emails.
            </p>
          </div>

          <form action="" onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {mode === "signin" ? "Sign In" : "Create an account"}
                </h2>
                <div className="text-sm text-gray-500">
                  {mode === "signin" ? (
                    <span>
                      New here?{" "}
                      <button
                        type="button"
                        className="text-sky-600 hover:underline"
                        onClick={() => setMode("signup")}
                      >
                        Create account
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-sky-600 hover:underline"
                        onClick={() => setMode("signin")}
                      >
                        Sign in
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* {errors && <div className="mb-4 text-sm text-red-600">{errors}</div>} */}
              <>
                <label className="block mb-2 text-sm text-gray-600">Email</label>
                <input
                  value={FormData.email}
                  onChange={handleInputChange}
                  type="email"
                  name="email"
                  required
                  className={`w-full mb-4 p-3 border text-black rounded focus:outline-none focus:ring-2 focus:ring-sky-200 ${errors.email ? "border-red-500" : "border-[#dbdbdb] focus:border-gray-500"
                    }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
                )}
              </>
              {mode === "signup" && (
                <>
                  <label className="block mb-2 text-sm text-gray-600">
                    Username
                  </label>
                  <input
                    value={FormData.username}
                    onChange={handleInputChange}
                    type="text"
                    name="username"
                    className={`w-full mb-4 p-3 border text-black rounded focus:outline-none focus:ring-2 focus:ring-sky-200 ${errors.username ? "border-red-500" : "border-[#dbdbdb] focus:border-gray-500"
                      }`}
                    placeholder="username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.username}</p>
                  )}
                </>
              )}

              <div className="relative">
                <label className="block mb-2 text-sm text-gray-600">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={FormData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full mb-4 p-3 text-black border rounded focus:outline-none focus:ring-2 focus:ring-sky-200 ${errors.password ? "border-red-500" : "border-[#dbdbdb] focus:border-gray-500"
                    }`}
                />
                <button type="button"
                  onClick={() => setshowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 text-[12px] font-semibold dark:text-gray-400">
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !FormData.email || !FormData.password}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded font-medium disabled:opacity-60"
              >
                {isLoading
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}