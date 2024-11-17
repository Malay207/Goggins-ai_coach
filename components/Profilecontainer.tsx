// "use client"
// import React, { useState } from 'react'
// import { Button } from './ui/button';
// import { Switch } from './ui/switch';
// import Dificultycard from './Dificultycard';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const difficulties = [
//   {
//     id: "EASY",
//     level: "Easy",
//     description: "This challenges is for people who are new to the Programm.Recieve 3 challenges per day.(7:30AM,12PM,5:30PM IST)",
//   },
//   {
//     id: "MEDIUM",
//     level: "Medium",
//     description: "This challenges is for people who are comfortable with the Programm.Recieve 4 challenges per day.(7AM,12:30PM,5:30PM,8PM IST)"

//   },
//   {
//     id: "HARD",
//     level: "Hard",
//     description: "This challenges is for people who are comfortable with the Programm.Recieve 5 challenges per day.(6AM,9AM,12PM,5PM,8PM IST)",
//   }
// ]

// interface challengepreference {
//   id: string;
//   UserId: string,
//   ChallengeId: string,
//   date: string,
//   pushnotifications: boolean,
// }
// interface profilecontainerprops {
//   plainChallengePreference: challengepreference;
// }
// type difficultylevel = "EASY" | "MEDIUM" | "HARD";
// const Profilecontainer = ({ plainChallengePreference }: profilecontainerprops) => {
//   const [saving, setsaving] = useState(false)
//   const [Sendnotification, setSendnotification] = useState(plainChallengePreference.pushnotifications);
//   const [Selectdificulties, setSelectdificulties] = useState(plainChallengePreference.ChallengeId);

//   const handletoogle = () => {
//     setSendnotification((prev) => !prev);
//   }
//   const handledifficulty = (difficultyId: difficultylevel) => {
//     setSelectdificulties(difficultyId);
//     // update user preference with selected difficulty
//   }
//   const handlesave = async () => {
//     setsaving(true);
//     try {
//       const response = await axios.post<{
//         success: boolean,
//         message?: string,
//         data?: challengepreference

//       }>("/api/challenge-preference", {
//         _Id: plainChallengePreference.id,
//         ChallengeId: Selectdificulties,
//         pushnotifications: Sendnotification,
//       });
//       if (!response.data.success || !response.data.data) {
//         toast.error(response.data.message ?? "Something went wrong")
//         return;
//       }
//       toast.success("Challenge preference updated successfully");

//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.Please try again")
//     }
//     finally {
//       setsaving(false);
//     }
//   }
//   return (
//     <div className='flex flex-col'>
//       <div className='flex flex-row justify-between items-center mb-4'>
//         <h1 className='font-bold text-2xl'>Challenge Level</h1>
//         <Button onClick={handlesave}>{saving ? "saving..." : "Save"}</Button>
//       </div>
//       {/* push notification */}
//       <div className='flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg'>
//         <div>
//           <h3 className='font-medium text-lg text-gray-900'>Push Notification</h3>
//           <p>Recive Push Notification when new challenges are available.</p>
//         </div>
//         <Switch checked={Sendnotification} onCheckedChange={handletoogle} />
//       </div>
//       {/* challenges */}
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//         {
//           difficulties.map((difficulty) => {
//             return <Dificultycard
//               key={difficulty.id}
//               level={difficulty.level}
//               description={difficulty.description}
//               selected={difficulty.id === Selectdificulties}
//               onselect={() => handledifficulty(difficulty.id as difficultylevel)}
//             />

//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default Profilecontainer