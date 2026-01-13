import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
}) => {
  const baseStyles = "flex-row items-center justify-center rounded-xl";

  const variantStyles = {
    primary: "bg-primary-500 active:bg-primary-600",
    secondary: "bg-secondary-500 active:bg-secondary-600",
    outline: "bg-transparent border-2 border-primary-500",
    ghost: "bg-transparent",
  };

  const disabledStyles = {
    primary: "bg-gray-300",
    secondary: "bg-gray-300",
    outline: "border-gray-300",
    ghost: "opacity-50",
  };

  const sizeStyles = {
    sm: "py-2 px-4",
    md: "py-3.5 px-6",
    lg: "py-4 px-8",
  };

  const textVariantStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary-500",
    ghost: "text-primary-500",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${isDisabled ? disabledStyles[variant] : variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "secondary"
              ? "#ffffff"
              : "#22c55e"
          }
          size="small"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && iconPosition === "left" && icon}
          <Text
            className={`
              font-semibold
              ${isDisabled ? "text-gray-500" : textVariantStyles[variant]}
              ${textSizeStyles[size]}
            `}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
};
