# SISI PROJECT OVERVIEW

- platform for county government
- help public participation in areas - projects - laws - monitoring - feedback

## Project Structure

    /src
      /pages
        ....
      /comonents
        .....
      /hooks
        .....
      /utils
        .....

## Pages

    1. Home
        - Have an overview of what the platform has and does

    2. Authentication
            * Register
            * Login
            * Forgot password
            * sms confirmation code

    3. Projects
            * Project display (show entire projects with status)
            * single project page (:id/:slug)
            * project proposal page
            * monitoring (metrics & performnce)
    4. Wards
            * display wards
            * single ward (Listing everything it has)

    5. Participate
            * Voting
            * monitor (money)
            * feedback
    6. About page
        - Talk about the county

    7. Contact page
        - Contacts, form, support, googlemap for that county and directions to that county

### Components

    ** universal **
        - PrimaryButton

        export const PrimaryButton ({onClick,title}:{onClick:()=>null, title:string})=>{
            return(
                <>
                <button className="bg-red-500 px-6 py-4 min-w-xl" onClick={onClick}>
                    {title}
                </button>
                </>
            )
        }

        - StatusPill
          // create this component


    ** Authentication **

        - InputField
            export const InputField (props:PropType)=>{
                return (
                    <>
                        <input
                            className={`border-2 {props.bgColor}`}
                            value = {props.inputValue}
                            onChange={(e)=>props.setInputValue(e.target.value)}
                            type={props.type || "text"}
                        />
                    </>
                )
            }

     ** Projects **

        - ProjectCard

            export const ProjectCard (props:PropsType)=>{

                return (
                    <div>
                    <StatusPill status={props.status} bgColor={props.status === "rejected" ? "bg-red-600" : props.status ==== "accepted" ? "bg-green-600" : "bg-slate-600"}>

                        {/* define how your card will appear */}

                    <div className="flex flex-row justify-between">
                        <PrimaryButton title="vote" onClick={props.handleVote} />

                        <PrimaryButton title="Reject" bgColor="bg-red-500" onClick={props.handleReject} />

                        <PrimaryButton title="Feedback" bgColor="bg-slate-500" onClick={props.handleFeedback} />

                    </div>
                    </div>
                )
            }

            /???? Come up with other components here

    ** Wards **
        - WardDisplayCard
         const WardDisplayCard ({...props}:{...type})=>{
            return(
                /* add content here */
            )
         }

     /???? Come up with other components here
