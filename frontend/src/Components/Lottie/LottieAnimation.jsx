import Lottie from "lottie-react";

export const LottieAnimation = ({ animationData, loop, size }) => {
    return (
        <Lottie
            animationData={animationData}
            loop={loop}
            size={size}
        />
    )
}