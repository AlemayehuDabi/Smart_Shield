import { type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ScalePressable({
  children,
  className = '',
  ...props
}: PressableProps & { children: ReactNode; className?: string }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...props}
      className={className}
      style={[props.style, style]}
      onPressIn={(e) => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 12, stiffness: 360 });
        props.onPressOut?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}
