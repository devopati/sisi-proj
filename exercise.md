# SISI exercises

Each exercise adds something to the SISI app or improves something that already works. Read the files mentioned before you start: most of what you need is already in the project.

## Before you start

```bash
npm run api   # the practice API, in one terminal
npm run dev   # the app, in a second terminal
```

- Log in with `demo@example.com` / `password123`.
- The API terminal prints every request the app makes. Keep an eye on it, it tells you a lot.
- Every response is slowed down by 500 ms on purpose. Use `DELAY=0 npm run api` if it gets in your way.
- Restarting the API resets all data and logs everyone out.
- [README.md](README.md) shows where everything lives. [API.md](API.md) lists every endpoint.

---

## Level 1: props and state

### 1. Show or hide the password

Password fields only show dots. Add a "Show" button inside password fields that reveals the text.

**Where:** [src/components/shared/ui/InputField.tsx](src/components/shared/ui/InputField.tsx)

**Hints**
- Only add the button when the `type` prop is `"password"`.
- Keep a `visible` boolean in state and pick the input's `type` from it.
- The button needs `type="button"`, or clicking it will submit the form.

**Done when**
- [ ] Clicking "Show" reveals the password and the button now says "Hide"
- [ ] It works on Login, Register and Forgot password without changing those pages
- [ ] Other inputs (email, phone) don't get the button

### 2. Milestone count and days left

On a project page, show how many milestones are done and how much time is left.

**Where:** [src/components/projects/MilestoneList.tsx](src/components/projects/MilestoneList.tsx), [src/pages/ProjectDetails.tsx](src/pages/ProjectDetails.tsx), [src/utils/format.ts](src/utils/format.ts)

**Hints**
- You don't need new state. Work the values out from the data: `milestones.filter(...).length`.
- Write the date logic as a function in `format.ts` that takes `endDate` and returns text.
- Remember `endDate` can be `null`.

**Done when**
- [ ] Above the milestones it says, for example, "2 of 4 milestones done"
- [ ] The money box shows "64 days left", "Finished" (for completed projects) or "Overdue by 5 days"
- [ ] Projects with no end date don't show anything broken

### 3. Copy the project link

Add a "Copy link" button to the project page.

**Where:** [src/pages/ProjectDetails.tsx](src/pages/ProjectDetails.tsx)

**Hints**
- `await navigator.clipboard.writeText(window.location.href)`
- Use a `copied` state to change the button text, and `setTimeout` to change it back.

**Done when**
- [ ] Clicking the button copies the URL
- [ ] The button says "Copied" for 2 seconds, then goes back to "Copy link"

---

## Level 2: forms

### 4. Check the Register form before sending it

Right now the form goes straight to the API. Check it in the browser first and show errors under each field.

**Rules**
- Phone: 10 digits, starting with `07` or `01`
- Password: at least 8 characters
- New field "Confirm password": must match the password

**Where:** [src/pages/Register.tsx](src/pages/Register.tsx), [src/components/shared/ui/InputField.tsx](src/components/shared/ui/InputField.tsx)

**Hints**
- Write a `validate(form)` function that returns an object of errors, like `{ phone: "Use 10 digits starting with 07 or 01" }`.
- Give `InputField` a new optional `error` prop and show it in red under the input.
- Only call the API when the errors object is empty.
- "Confirm password" shouldn't be sent to the API.

**Done when**
- [ ] Each wrong field shows its own message, and nothing is sent to the API (check the API terminal)
- [ ] Fixing a field and submitting again clears its message
- [ ] A valid form still registers you and sends the SMS code

### 5. Sort the projects

Add a "Sort by" dropdown on the Projects page: Newest, Most support, Biggest budget.

**Where:** [src/pages/Projects.tsx](src/pages/Projects.tsx)

**Hints**
- Sort the list in the browser after it arrives. You don't need a new API call.
- `.sort()` changes the original array. Sort a copy: `[...projects].sort(...)`.
- Keep the choice in the URL (`?sort=support`) like the other filters, so a sorted list can be shared. The API ignores it.

**Done when**
- [ ] Each option orders the cards correctly
- [ ] Sorting still works together with the stage, ward and search filters
- [ ] Refreshing the page keeps the chosen sort

---

## Level 3: useEffect and fetching

### 6. Search that waits for typing to stop

Type "borehole" in the Projects search and watch the API terminal: one request per letter. Make it wait until you stop typing.

**Where:** new file `src/hooks/useDebounce.ts`, [src/pages/Projects.tsx](src/pages/Projects.tsx)

**Hints**
- `useDebounce(value, delay)` returns `value`, but only after it has stopped changing for `delay` milliseconds.
- Inside it: a `useEffect` that starts a `setTimeout`, with a cleanup that clears it.
- The search box will need its own state for the text you're typing. Write the debounced value to the URL.

**Done when**
- [ ] Typing "borehole" quickly makes one request, not eight
- [ ] Results still update about 400 ms after you stop typing
- [ ] The search text survives a page refresh

### 7. Remember my votes

Vote on a project, then refresh the page: the button no longer shows your vote, because the API doesn't send it back. Remember it in the browser.

**Where:** new file `src/hooks/useLocalStorage.ts`, [src/hooks/useVote.ts](src/hooks/useVote.ts)

**Hints**
- `useLocalStorage(key, initialValue)` works like `useState` but also saves to `localStorage`.
- Read the saved value in `useState(() => ...)` so it only happens once.
- `localStorage` stores strings. Use `JSON.stringify` and `JSON.parse`.
- Use a different key for each user and each project, like `vote-1-5`.

**Done when**
- [ ] After a refresh, the button you voted with is still highlighted
- [ ] Another user logging in on the same browser doesn't see your votes

### 8. "My proposals" page

Add a page at `/my-proposals` that lists the projects the logged-in user proposed.

**Where:** [src/App.tsx](src/App.tsx), new file `src/pages/MyProposals.tsx`, [src/components/shared/common/Header.tsx](src/components/shared/common/Header.tsx)

**Hints**
- Fetch `/projects`, then keep the ones where `proposedBy === user.name`.
- Wrap the route in `<RequireAuth>` like the propose page.
- Reuse `ProjectCard` and `PageHeader`.
- The demo user has no proposals yet. Propose one first.

**Done when**
- [ ] Logged-out visitors are sent to the login page, then back here after logging in
- [ ] The page lists only your proposals
- [ ] With no proposals, it says so and links to "Propose a project"
- [ ] There's a link to the page in the header when you're logged in

---

## Level 4: more hooks

### 9. useRef: put the cursor where it's needed

When the SMS code step appears, the cursor should already be in the code box. When the validation from exercise 4 fails, the cursor should jump to the first wrong field.

**Where:** [src/pages/Register.tsx](src/pages/Register.tsx)

**Hints**
- Don't use the `autoFocus` attribute. It can't handle the second part.
- `InputField` already passes a `ref` through to its `<input>`.
- Call `.focus()` in a `useEffect` that runs when `step` changes.

**Done when**
- [ ] The code box is focused as soon as the code step appears
- [ ] Submitting with a wrong phone number puts the cursor in the phone field

### 10. useReducer: one place for Register's state

`Register.tsx` has six `useState` calls that change together. Replace them with one `useReducer`.

**Where:** [src/pages/Register.tsx](src/pages/Register.tsx)

**Hints**
- Start by listing what can happen: the form is edited, it's submitted, the code is sent, the request fails, the user goes back.
- Each of those becomes an action, like `{ type: "codeSent", devCode: "1234" }`.
- Keep the reducer outside the component.

**Done when**
- [ ] The component has a single `useReducer` and no `useState`
- [ ] Registering, wrong codes, going back and verifying all work as before

### 11. useMemo: sort the Monitoring table

Let people click the Budget, Spent and Built column headings to sort the table. Click again to flip the order.

**Where:** [src/pages/Monitoring.tsx](src/pages/Monitoring.tsx)

**Hints**
- Keep `sortBy` and `direction` in state.
- Work out the sorted rows with `useMemo`, with the data and both sort values as dependencies.
- Show which column is sorted, and in which direction. For screen readers, set `aria-sort` on the heading.

**Done when**
- [ ] Each heading sorts the table and a second click reverses it
- [ ] The sorted column is marked
- [ ] You can explain whether `useMemo` was needed for 5 rows, and when it would be

### 12. useCallback: stop an infinite loop

`refetch` from `useFetch` is a new function every time the component renders. Find out why that matters.

**Where:** [src/hooks/useFetch.ts](src/hooks/useFetch.ts), any page that uses it

**Steps**
1. In a page, add `useEffect(() => { refetch(); }, [refetch]);`
2. Watch the API terminal. What happens, and why?
3. Fix it inside `useFetch` with `useCallback`.

**Done when**
- [ ] You can explain the loop in one or two sentences
- [ ] After your fix, the effect above runs once
- [ ] Remove the test effect from the page when you're done

### 13. useImperativeHandle: a smaller ref

A ref on `InputField` currently gives the parent the whole `<input>` element. Make it give only two things: `focus()` and `selectAll()`.

**Where:** [src/components/shared/ui/InputField.tsx](src/components/shared/ui/InputField.tsx)

**Hints**
- In React 19, `ref` is a normal prop. Pull it out of the props instead of passing it on.
- Keep your own `useRef` for the real input, and use `useImperativeHandle(ref, () => ({ ... }))`.
- Export a type for the handle so parents can write `useRef<InputFieldHandle>(null)`.

**Done when**
- [ ] `ref.current.focus()` and `ref.current.selectAll()` work from a parent
- [ ] `ref.current.value` is a TypeScript error
- [ ] Exercise 9 still works

### 14. useDebugValue: see inside your hooks

Add `useDebugValue` to `useFetch` and `useAuth`, then look at a page in React DevTools.

**Where:** [src/hooks/useFetch.ts](src/hooks/useFetch.ts), [src/hooks/useAuth.ts](src/hooks/useAuth.ts)

**Done when**
- [ ] DevTools shows, for example, `Fetch: "/projects" loaded` and `Auth: Demo Citizen`
- [ ] You can explain who this hook is for (hint: not the people using the app)

---

## Group projects

### 15. Pop-up messages

Show a short message after something happens: "Vote recorded", "Feedback posted", "Logged out". Each one disappears after 4 seconds.

**Hints**
- Follow the same pattern as auth: a context file, a provider component and a `useToast()` hook.
- Keep a list of messages in the provider, so several can show at once.
- Put the list in an element with `aria-live="polite"` so screen readers announce new messages.

**Done when**
- [ ] Voting, posting feedback and logging out each show a message
- [ ] Messages stack, and each one disappears on its own
- [ ] Each message can also be closed with a button

### 16. Keyboard-friendly tabs

On the Participate page, the tabs only work with a mouse or by tabbing through every one. Make them work like real tabs.

**Where:** [src/pages/Participate.tsx](src/pages/Participate.tsx)

**Rules**
- Left and right arrow keys move between tabs and open them
- Home and End jump to the first and last tab
- Only the selected tab can be reached with the Tab key (`tabIndex={0}`, the others `-1`)

**Done when**
- [ ] You can use all three tabs with just the keyboard
- [ ] Pressing Tab from a tab moves into the open panel, not to the next tab

### 17. Dark mode

Add a light/dark switch to the header. Remember the choice.

**Where:** [src/index.css](src/index.css), a new theme context, [src/components/shared/common/Header.tsx](src/components/shared/common/Header.tsx)

**Hints**
- The colours in `@theme` become CSS variables. Override them under `:root[data-theme="dark"] { ... }`.
- Set `data-theme` on `<html>` from your context, and save the choice to `localStorage`.
- Search the project for `bg-white`: cards use it directly. Give it a token (like `--color-surface`) so it can change too.
- Check the status pills and the contour lines are still easy to see in dark mode.

**Done when**
- [ ] The switch changes every page, including forms and cards
- [ ] The choice survives a refresh
- [ ] Text is still easy to read everywhere
