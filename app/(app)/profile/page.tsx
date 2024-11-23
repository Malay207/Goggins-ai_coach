import { Challengepreferences } from '@/app/model/model';
import Profilecontainer from '../../../components/Profilecontainer';
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import database_connect from '@/app/db';

const ProfilePage = async () => {
  //get the user
  const {userId} = await auth();
  if (!userId) {
    throw new Error("no User found");
  }
  await database_connect();
  let challengepreference = await Challengepreferences.findOne({ UserId: userId });
  if (!challengepreference) {
    challengepreference = new Challengepreferences({
      UserId: userId,
      ChallengeId: "EASY",
    });
    await challengepreference.save();
  }
  const plainChallengePreference = {
    id: challengepreference._id.toString(), // Convert ObjectId to string
    UserId: challengepreference.UserId,
    ChallengeId: challengepreference.ChallengeId,
    pushnotifications: challengepreference.pushnotifications,
    date: challengepreference.date.toISOString(), // Convert Date to string
  };
  return (
    <div className='max-w-screen-lg m-10 lg:mx-auto'>
          <Profilecontainer plainChallengePreference={plainChallengePreference} />
    </div>
  )
}

export default ProfilePage
