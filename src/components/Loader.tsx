import React from "react";

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

interface TLoaderProps { text?: string, className?: string };

export const Loader = ({ text, className }: TLoaderProps) => {
  return <div className={`flex flex-col justify-center items-center ${className}`}>
    <Typography>{text}</Typography>
    <CircularProgress />
  </div>
}