import type { NextApiRequest, NextApiResponse } from "next";
import { getRenderProgress, RenderProgress } from "@remotion/lambda/client";

type QueryParams = {
  renderId: string;
  bucketName: string;
};

export type GetVideoProgressResponseData = RenderProgress;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetVideoProgressResponseData>
) {
  if (req.method === "GET") {
    const { renderId, bucketName } = req.query as QueryParams;

    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: "remotion-render-4-0-182-mem2048mb-disk2048mb-120sec",
      region: "ap-southeast-2",
    });

    res.status(200).json(progress);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
