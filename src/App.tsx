import React from 'react';
import { Octokit } from "octokit";
import { useAsyncFn } from "react-use";
import { useForm, SubmitHandler } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Loader } from "./components/Loader";
import { UserFollowerCard } from "./components/UserFollowerCard";

import { TFollower } from "./types/User";

const findCommonFollowers = (firstFollowers: TFollower[], secondFollowers: TFollower[]) => {
  const firstFollowerIds = firstFollowers.map(follower => follower.id);

  return secondFollowers.filter(follower => firstFollowerIds.includes(follower.id));
}

type TFormValues = {
  firstUsername: string,
  secondUsername: string;
}

function App() {

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TFormValues>();

  const [commonFollowersState, getCommonFollowers] = useAsyncFn(async (usernames: string[]) => {
    const octokit = new Octokit({ });

    const fetchFollowers = async (username: string) => {
      return octokit.paginate<TFollower>("GET /users/{username}/followers", {
        username,
        per_page: 100,
      });

    }

    const commonFollowers = await
      Promise.all(usernames.map(fetchFollowers))
      .then(([firstUserFollowers, secondUserFollowers]) => findCommonFollowers(firstUserFollowers, secondUserFollowers))

    return commonFollowers;
  }, []);

  const onSubmitHandler: SubmitHandler<TFormValues> = (values) => {
    getCommonFollowers([values.firstUsername, values.secondUsername])
  };
  
  return (
    <div className="flex justify-start items-center flex-col h-screen mt-6">
      <Box className="flex flex-col" component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="flex">
          <TextField
            className="!mr-4"
            label="First username"
            error={!!errors.firstUsername}
            helperText={errors.firstUsername && "This field is required"}
            {...register('firstUsername', { required: true })}
          />
          <TextField
            label="Second username"
            error={!!errors.secondUsername}
            helperText={errors.secondUsername && "This field is required"}
            {...register('secondUsername', { required: true })}
          />
        </div>
        <Button className="!mt-2" type='submit'>Find common followers</Button>
      </Box>

      { commonFollowersState.loading && <Loader className="mt-10" text="Fetching & looking for common followers" />}

      { !commonFollowersState.loading && !commonFollowersState.error && commonFollowersState.value &&
        <div className='flex flex-col items-center mt-4'>
          <Typography className="!mt-3" variant="h4" component="h4">
            Common followers
          </Typography>
          <div className='flex justify-center flex-wrap'>
            {commonFollowersState.value.map(follower => 
              <UserFollowerCard
                key={follower.id}
                displayName={follower.login}
                avatarUrl={follower.avatar_url}
                profileLink={follower.html_url}
              />
            )}
          </div>
        </div>
      }

      {
        !commonFollowersState.loading && 
        !commonFollowersState.error && 
        commonFollowersState.value &&
        commonFollowersState.value.length === 0 &&
        <Typography className="!mt-3" variant="h4" component="h4">
            No common followers was found
        </Typography>
      }

      {
        !commonFollowersState.loading &&
        commonFollowersState.error && 
        <>
        <Typography className="!mt-3" variant="h6" component="h6">
          Unfortunately, while performing this operation, the following error occured:
        </Typography>
         <Typography className="!mt-3" variant="h4" component="h4">
          {commonFollowersState.error.message}
         </Typography>
        </>
      }
    </div>
  );
}

export default App;
