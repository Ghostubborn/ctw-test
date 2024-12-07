'use client';

import { UserRankDetailData } from "@/types/user-rank";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: UserRankDetailData['rankHistory'],
  width: number;
  height: number;
}
export default function UserRankChart({ data, width, height }: Props) {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="score" />
    </LineChart> 
  )
}
