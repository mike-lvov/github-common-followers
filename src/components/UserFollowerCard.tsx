import React from "react";

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

interface TUserFollowerCardProps {
  displayName: string;
  avatarUrl: string;
  profileLink: string;
}

export const UserFollowerCard = ({ displayName, avatarUrl, profileLink }: TUserFollowerCardProps) => {
  return <Card className='flex flex-col justify-center items-center m-2 p-2' variant="outlined">
    <div className="flex justify-around items-center mb-2">
      <Avatar className="!mr-1" alt={displayName} src={avatarUrl} />
      <span>{displayName}</span>
    </div>
    
    <Link href={profileLink}>Github profile</Link>
  </Card>
}