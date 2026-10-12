/**
 * useEffect Hook
 */

// import { useEffect, useState } from "react";

// /**
//  *
//  * useEffect Hook
//  * Allows you to perform side effects in your components.
//  * example: fetching data, directly updating the DOM, and timers.
//  *
//  * useEffect accepts two arguments. The first argument is a callback function that contains the code you want to run as a side effect. The second argument is an optional array of dependencies that determines when the effect should run.
//  * useEffect (<function>, <dependencies>)
//  *
//  * useEffect (()=>{
//  * // Runs on the first render
//  * //And any time any dependency value changes
//  * },[prop, state])
//  *
//  * Effect cleanup
//  * If your effect returns a function, React will run it when it is time to clean up, such as before the component unmounts or before running the effect next time.
//  * Timeouts, subscriptions, and event listeners are common examples of side effects that require cleanup.
//  *
//  * Done by including a return function at the end of your effect callback function.
//  *
//  */

// const App = () => {
//   const [count, setCount] = useState(0);
//   const [name, setName] = useState("John Doe");
//   const [age, setAge] = useState(30);

//   useEffect(() => {
//     let timer = setTimeout(() => {
//       setCount(count + 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [name, age]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <h1 className="text-4xl font-bold">useEffect Hook</h1>
//       <p className="text-2xl">I've rendered {count} times</p>
//       <button
//         className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//         onClick={() => setName(name === "John Doe" ? "Jane Doe" : "John Doe")}
//       >
//         Change Name
//       </button>
//     </div>
//   );
// };

// export default App;

// ==================================== useContext Hook ====================================
/**
 * useContext Hook
 */

// import { useState, createContext, useContext } from "react";

// type User = {
//   name: string;
//   age: number;
// };

// const UserContext = createContext<User | null>(null);

// const Component1 = () => {
//   const user = useContext(UserContext);

//   return (
//     <div>
//       <h1>{`Hello user ${user?.name}`}</h1>
//     </div>
//   );
// };

// const Component2 = () => {
//   return (
//     <div>
//       <h1>Component 2</h1>
//     </div>
//   );
// };

// const Component3 = () => {
//   const user = useContext(UserContext);
//   return (
//     <div>
//       <h1>Component 3</h1>
//       <p>{`Hello: ${user?.name}, Age: ${user?.age} again!`}</p>
//     </div>
//   );
// };

// const App = () => {
//   const [user, setUser] = useState<User>({ name: "John Doe", age: 30 });
//   return (
//     <UserContext.Provider value={user}>
//       <div className="flex flex-col items-center justify-center h-screen gap-4">
//         <Component1 />
//         <Component2 />
//         <Component3 />
//       </div>
//     </UserContext.Provider>
//   );
// };

// export default App;

// ====================== useRef Hook ======================
/**
 * useRef Hook
 */

/**
 *
 * Allows you to persist values between renders. It can be used to store a mutable value that does not cause a re-render when updated. It can also be used to access a DOM element directly.
 *
 */

// ======================
// Accessing DOM elements
/**
 * useRef can be used to access a DOM element directly. It can be used to focus an input element, scroll to a specific element, or measure the size of an element.
 *
 * Example:
 *
 * const inputRef = useRef<HTMLInputElement>(null);
 *
 * Attach the ref to a DOM element using the ref attribute:
 *
 * <input ref={inputRef} type="text" />
 *
 * You can then access the DOM element using the current property of the ref object:
 *
 * inputRef.current.focus();
 */

// import { useRef } from "react";

// const App = () => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFocus = () => {
//     inputRef.current?.focus();
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <input ref={inputRef} type="text" placeholder="Type here..." />
//       <button
//         className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//         onClick={handleFocus}
//       >
//         Focus Input
//       </button>
//     </div>
//   );
// };

// export default App;

// ======================

//Tracking state changes

/**
 * useRef can also be used to track state changes without causing a re-render. This can be useful for keeping track of previous values or for storing values that don't need to trigger a re-render when they change.
 * This is so becouse we are able to persit useRef values between renders without causing a re-render when the value changes.
 */

// import { useRef, useState, useEffect } from "react";

// const App = () => {
//   const [inputValue, setInputValue] = useState("");
//   const previousValueRef = useRef<string>("");

//   useEffect(() => {
//     previousValueRef.current = inputValue;
//   }, [inputValue]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Type here..."
//       />
//       <p>Current Value: {inputValue}</p>
//       <p>Previous Value: {previousValueRef.current}</p>
//     </div>
//   );
// };

// export default App;

//=========== Exercise Research on this ===========>
/**
 * useReducer
 * useCallback
 * useMemo
 * useLayoutEffect
 * useImperativeHandle
 * useDebugValue
 * custom Hooks
 */

// import { img1, img3, img2 } from "./assets/images";
// import CommonLayout from "./components/shared/common/CommonLayout";
// import ProjectProvider from "./hooks/projectContext";

// const App = () => {
//   return (
//     <ProjectProvider>
//       <CommonLayout>
//         <div>
//           <h1 className="text-4xl font-bold">Welcome to the App!</h1>
//           <h1 className="text-4xl font-bold">Welcome to the App!</h1>
//           <img src={img1} className="w-40 h-40 rounded-full" />
//           <img src={img2} className="w-40 h-40 rounded-full" />
//           <img src={img3} className="w-40 h-40 rounded-full" />
//         </div>
//       </CommonLayout>
//     </ProjectProvider>
//   );
// };

// export default App;

// Working with pages: React Router
/**
 * Each <Route> maps a URL to a page.
 * The routes nested inside CommonLayout render in its <Outlet />, between the header and footer.
 * ":id" and ":slug" are URL params; read them in the page with useParams().
 */

// ======================== TODAY'S GOAL ================================= //

import { Route, Routes } from "react-router";
import RequireAuth from "./components/auth/RequireAuth";
import CommonLayout from "./components/shared/common/CommonLayout";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Monitoring from "./pages/Monitoring";
import NotFound from "./pages/NotFound";
import Participate from "./pages/Participate";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import ProposeProject from "./pages/ProposeProject";
import Register from "./pages/Register";
import WardDetails from "./pages/WardDetails";
import Wards from "./pages/Wards";

const App = () => {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route index element={<Home />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        <Route path="projects" element={<Projects />} />
        <Route
          path="projects/propose"
          element={
            <RequireAuth>
              <ProposeProject />
            </RequireAuth>
          }
        />
        <Route path="projects/monitoring" element={<Monitoring />} />
        <Route path="projects/:id/:slug?" element={<ProjectDetails />} />

        <Route path="wards" element={<Wards />} />
        <Route path="wards/:id" element={<WardDetails />} />

        <Route path="participate" element={<Participate />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<ContactUs />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;

// ======================== ROUTING ======================== //
/**
 * useNavigation --> used to programatically  navigate in react
 * It returns a function that allows you to redirect users based on logic or events
 *
 * useLocation () --> Is a hook that returns an object, that represents the current url location of the application
 * useParams () -->  is a Hook used to extract dynamic routing parameters form the current url
 */

// import { Link, useNavigate, useLocation, useParams } from "react-router";

// const Page1 = () => {
//   const navigate = useNavigate();

//   const handleNavigation = () => {
//     navigate("/page3/#date/?filter=today", {
//       state: { name: "Simon", age: 200 },
//     });
//     // navigate(-1); //navigate backwards
//     // navigate(1); //navigate Forward
//   };
//   return (
//     <div className="flex flex-col gap-4">
//       <h1>Projects</h1>
//       <Link to="/page2">Navigae to page 2</Link> {/**Internal navigation */}
//       {/* <button onClick={handleNavigation}>BTN Page 3</button> */}
//     </div>
//   );
// };
// const Page2 = () => {
//   return (
//     <div>
//       <h1>Project details</h1>
//       <Link to="/">Navigae to page 1</Link>
//       <Link to="/page3/12345">Navigae to page 3</Link>
//     </div>
//   );
// };
// const Page3 = () => {
//   // const { pathname, search, hash, state } = useLocation();
//   const { projectId } = useParams();
//   return (
//     <div>
//       <h1>Page 3</h1>
//       <Link to="/">Navigae to page 1</Link>
//       <p>{projectId}</p>
//     </div>
//   );
// };

// import { Routes, Route } from "react-router";

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Page1 />} index />
//       <Route path="/page2" element={<Page2 />} />
//       <Route path="/page3/:projectId" element={<Page3 />} />
//     </Routes>
//   );
// };

// export default App;

// =============== FORMS & VALIDATION ==============
/**
 * Allows users to interact with our web pages
 */

// import React, { useEffect, useState } from "react";

// const App = () => {
//   const [formValues, setFormValues] = useState({
//     name: "",
//     age: "30",
//     phone: "",
//     msg: "",
//   });

//   // Function to update multiple form values
//   const handleUpdate = (
//     e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
//   ) => {
//     const { name, value } = e.target;

//     setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
//   };

//   const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (formValues.phone.length < 10) {
//       alert("Number is less than 10");
//     } else {
//       alert("Number more than 10");
//     }
//     console.log(formValues);
//   };

//   // Fetching data in React
//   const [projects, setProjects] = useState<any>();
//   const fetchProjects = async () => {
//     let res;
//     try {
//       res = await fetch(`http://localhost:4000/api/projects`, {
//         method: "GET",
//       });
//     } catch {
//       throw new Error("Can't reach the SISI API. Start it with `npm run api`.");
//     }

//     // convert to json
//     const data = await res.json();
//     if (!res.ok) throw new Error("failed");
//     setProjects(data);
//     console.log(data);
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <div className="flex flex-col justify-center items-center py-10">
//       <form onSubmit={handleSubmit} className="border rounded-xl p-5 gap-4">
//         <p>
//           {"name: " + formValues.name} {"age: " + formValues.age}{" "}
//           {"phone: " + formValues.phone} {"Msg: " + formValues.msg}
//         </p>
//         <div className="flex flex-col gap-4">
//           <label>Name</label>
//           <input
//             required
//             className="border p-2 rounded w-52"
//             type="email"
//             placeholder="Enter your name"
//             value={formValues.name}
//             name="name"
//             onChange={handleUpdate}
//           ></input>
//         </div>

//         <div className="flex flex-col gap-4">
//           <label>Age</label>
//           <input
//             className="border p-2 rounded w-52"
//             type="text"
//             placeholder="Enter your age"
//             value={formValues.age}
//             name="age"
//             onChange={handleUpdate}
//           ></input>
//         </div>

//         <div className="flex flex-col gap-4">
//           <label>Number</label>
//           <input
//             className="border p-2 rounded w-52"
//             type="tel"
//             placeholder="Enter your number"
//             value={formValues.phone}
//             name="phone"
//             onChange={handleUpdate}
//           ></input>
//         </div>

//         <div className="flex flex-col gap-4">
//           <label>Message</label>
//           <input
//             className="border p-2 rounded w-52"
//             type="text"
//             placeholder="Enter your Message"
//             value={formValues.msg}
//             name="msg"
//             onChange={handleUpdate}
//           ></input>
//         </div>

//         <button>Show data</button>
//       </form>
//     </div>
//   );
// };

// export default App;
