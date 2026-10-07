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

// Working with pages

import ContactUs from "./pages/ContactUs";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

const App = () => {
  return (
    <div>
      <>
        {/* <Home /> */}
        {/* <Projects /> */}
        <ContactUs />
      </>
    </div>
  );
};

export default App;
