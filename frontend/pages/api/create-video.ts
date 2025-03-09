import type { NextApiRequest, NextApiResponse } from "next";
import { renderMediaOnLambda } from "@remotion/lambda/client";

type RequestData = {
  mainText: string;
  subText: string;
  logoUrl: string;
  primaryColor: string;
};

export type CreateVideoResponseData = {
  bucketName: string;
  renderId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateVideoResponseData>
) {
  if (req.method === "POST") {
    const { mainText, subText, logoUrl, primaryColor } =
      req.body as RequestData;

    const { bucketName, renderId } = await renderMediaOnLambda({
      region: "ap-southeast-2",
      functionName: "remotion-render-4-0-182-mem2048mb-disk2048mb-120sec",
      composition: "IntroAnimtaion",
      serveUrl:
        "https://remotionlambda-apsoutheast2-3xj1q4wewy.s3.ap-southeast-2.amazonaws.com/sites/render-video/index.html",
      codec: "h264",
      inputProps: {
        mainText,
        subText,
        logoUrl,
        primaryColor,
      },
    });

    res.status(200).json({ bucketName, renderId });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
