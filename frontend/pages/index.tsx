import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { CreateVideoResponseData } from "./api/create-video";
import type { GetVideoProgressResponseData } from "./api/get-video-progress";

const VideoGeneratorApp = () => {
  const [formData, setFormData] = useState({
    mainText: "Koala 聊开源",
    subText: "陪伴你成长的技术频道",
    logoUrl:
      "https://render-video-api-public.s3.ap-southeast-2.amazonaws.com/koala.png",
    primaryColor: "#f6e58d",
  });
  const [createVideoData, setCreateVideoData] =
    useState<CreateVideoResponseData>({
      bucketName: "",
      renderId: "",
    });
  const [progress, setProgress] = useState<GetVideoProgressResponseData | null>(
    null
  );

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setCreateVideoData(data);
    } catch (error) {
      console.error("Error creating video:", error);
    }
  };

  useEffect(() => {
    if (createVideoData.renderId) {
      const checkProgress = async () => {
        try {
          const response = await fetch(
            `/api/get-video-progress?renderId=${createVideoData.renderId}&bucketName=${createVideoData.bucketName}`
          );
          const data = await response.json();
          setProgress(data);
          if (!data.done) {
            setTimeout(checkProgress, 1000);
          }
        } catch (error) {
          console.error("Error checking progress:", error);
        }
      };
      checkProgress();
    }
  }, [createVideoData]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Video Generator</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          required
          name="mainText"
          value={formData.mainText}
          placeholder="Main Text"
          onChange={handleInputChange}
        />
        <Input
          required
          name="subText"
          value={formData.subText}
          placeholder="Sub Text"
          onChange={handleInputChange}
        />
        <Input
          required
          name="logoUrl"
          value={formData.logoUrl}
          placeholder="Logo URL"
          onChange={handleInputChange}
        />
        {formData.logoUrl && (
          <img
            src={formData.logoUrl}
            alt="Logo preview"
            className="w-32 h-32 object-contain mx-auto"
          />
        )}
        <div>
          <label
            htmlFor="primaryColor"
            className="block text-sm font-medium text-gray-700"
          >
            Primary Color
          </label>
          <input
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={formData.primaryColor}
            className="mt-1 block w-full"
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Generate Video
        </Button>
      </form>
      {createVideoData.renderId && (progress?.overallProgress || 0) < 1 && (
        <div className="mt-6">
          <p className="text-center mb-2">Generating video...</p>
          <Progress
            value={(progress?.overallProgress || 0) * 100}
            className="w-full"
          />
        </div>
      )}
      {progress?.outputFile && (
        <div className="mt-6">
          <video
            controls
            src={progress?.outputFile}
            className="w-full rounded-lg shadow-md"
          />
          <a
            href={progress?.outputFile}
            download={progress.outKey}
            className="mt-4 inline-block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoGeneratorApp;
