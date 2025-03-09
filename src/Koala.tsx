// Src/IntroAnimation.tsx
import {
  useCurrentFrame,
  interpolate,
  Sequence,
  AbsoluteFill,
  Easing,
  Img,
} from "remotion";
import { Circle, Rect, Triangle } from "@remotion/shapes";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import Color from "color";

export const introAnimationSchema = z.object({
  mainText: z.string(),
  subText: z.string(),
  logoUrl: z.string().url(),
  primaryColor: zColor(),
});

export const IntroAnimation: React.FC<z.infer<typeof introAnimationSchema>> = ({
  mainText,
  subText,
  logoUrl,
  primaryColor,
}) => {
  const frame = useCurrentFrame();

  // Define key animations
  const rectProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const triangleProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const circleProgress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  const exitProgress = interpolate(frame, [0, 120, 150], [0, 0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
  });

  const bgSpacing = interpolate(frame, [0, 150, 240, 280], [12, 12, 48, 12], {
    extrapolateRight: "clamp",
  });

  const logoUpProgress = interpolate(frame, [0, 240, 300], [0, 0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
  });

  const mainTextProgress = interpolate(frame, [0, 300, 330], [0, 0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
  });

  const subCharsShown = Math.floor((frame - 360) / 3);
  const subTextToShow = subText.slice(0, subCharsShown);

  const bgColor = Color(primaryColor).fade(0.8);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: primaryColor,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 1)",
          backgroundImage: `
            radial-gradient(
              circle at center center,
              ${bgColor},
              #ffffff
            ),
            repeating-radial-gradient(
              circle at center center,
              ${bgColor},
              ${bgColor},
              ${bgSpacing}px,
              transparent ${2 * bgSpacing}px,
              transparent ${bgSpacing}px
            )`,
          backgroundBlendMode: "multiply",
          margin: "50px",
          border: "5px solid #333",
          width: "calc(100% - 100px)",
          height: "calc(100% - 100px)",
          position: "relative",
        }}
      >
        <Sequence durationInFrames={240}>
          <Rect
            width={120}
            height={120}
            fill={primaryColor}
            stroke="#333"
            strokeWidth={4}
            cornerRadius={20}
            style={{
              top: `${115 - 65 * rectProgress}%`,
              right: `${20 - 40 * exitProgress}%`,
              transform: `translate(-50%, -50%)`,
              position: "absolute",
              rotate: `${15 - 15 * rectProgress}deg`,
            }}
          />
        </Sequence>
        <Sequence from={30} durationInFrames={210}>
          <Triangle
            length={144}
            direction="up"
            fill={primaryColor}
            stroke="#333"
            strokeWidth={4}
            cornerRadius={20}
            style={{
              top: `${115 - 65 * triangleProgress}%`,
              left: `${20 - 40 * exitProgress}%`,
              transform: `translate(50%, -50%)`,
              position: "absolute",
              rotate: `${15 - 15 * triangleProgress}deg`,
            }}
          />
        </Sequence>
        <Sequence from={60} durationInFrames={180}>
          <Circle
            radius={60}
            fill={primaryColor}
            stroke="#333"
            strokeWidth={4}
            style={{
              top: `${115 - 65 * circleProgress}%`,
              left: "50%",
              transform: `translate(-50%, -50%) scale(${1 - exitProgress})`,
              position: "absolute",
              rotate: `${15 - 15 * circleProgress}deg`,
            }}
          />
        </Sequence>
        <Sequence from={130} durationInFrames={470}>
          <Img
            src={logoUrl}
            style={{
              top: `${50 - 20 * logoUpProgress}%`,
              left: "50%",
              transform: `translate(-45%, -50%) scale(${
                0.2 + 0.8 * exitProgress
              })`,
              position: "absolute",
            }}
          />
        </Sequence>

        <Sequence from={300} durationInFrames={300}>
          <h1
            style={{
              top: `50%`,
              left: "50%",
              transform: `translate(-45%, -50%) scale(${
                0.2 + 0.8 * exitProgress
              })`,
              position: "absolute",
              fontSize: 80,
              fontFamily: "monospace",
              color: "#333",
              opacity: mainTextProgress,
            }}
          >
            {mainText}
          </h1>
        </Sequence>

        <Sequence from={360} durationInFrames={240}>
          <h2
            style={{
              top: `65%`,
              left: "50%",
              transform: `translate(-45%, -50%) scale(${
                0.2 + 0.8 * exitProgress
              })`,
              position: "absolute",
              fontSize: 64,
              fontFamily: "sans-serif",
              color: "#333",
            }}
          >
            {subTextToShow}
          </h2>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
