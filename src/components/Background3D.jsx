import DarkvideoCart from "../assets/mixkit-smoke-effect-over-black-background-1967-full-hd.mp4"
import LightvideoCart from "../assets/100195-video-2160.mp4"

// components/Background3D.jsx
const Background3D = ({ theme = 'dark', darkVideo = DarkvideoCart, lightVideo = LightvideoCart }) => {
  const isLight = theme === 'light';
  return (
    <div className="absolute inset-0 -z-10 w-full h-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute inset-0"
        src={isLight ? lightVideo : darkVideo}
      />
    </div>
  );
};

export default Background3D;