import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "off" | "email" | "name" | "password" | "tel" | "username";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  hint,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  maxLength,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  icon,
  className = "",
  inputClassName = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = secureTextEntry && !showPassword;

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-dark-700 font-medium mb-2 text-sm">{label}</Text>
      )}
      <View
        className={`
          flex-row items-center bg-white rounded-xl border-2 px-4
          ${isFocused ? "border-primary-500" : error ? "border-red-500" : "border-gray-200"}
          ${!editable ? "bg-gray-100" : ""}
        `}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className={`
            flex-1 py-3.5 text-base text-dark-800
            ${multiline ? "min-h-[100px]" : ""}
            ${inputClassName}
          `}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2 p-1"
          >
            {showPassword ? (
              <EyeOff size={20} color="#64748b" />
            ) : (
              <Eye size={20} color="#64748b" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      {hint && !error && (
        <Text className="text-dark-400 text-sm mt-1">{hint}</Text>
      )}
    </View>
  );
};
