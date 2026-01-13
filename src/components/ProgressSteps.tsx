import React from "react";
import { View, Text } from "react-native";
import { Check, Circle, Loader } from "lucide-react-native";

interface Step {
  id: string;
  title: string;
  status: "completed" | "current" | "pending";
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  className = "",
}) => {
  return (
    <View className={`flex-row items-center justify-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Circle */}
          <View className="items-center">
            <View
              className={`
                w-8 h-8 rounded-full items-center justify-center
                ${step.status === "completed" ? "bg-primary-500" : ""}
                ${step.status === "current" ? "bg-primary-100 border-2 border-primary-500" : ""}
                ${step.status === "pending" ? "bg-gray-200" : ""}
              `}
            >
              {step.status === "completed" && <Check size={16} color="#fff" />}
              {step.status === "current" && (
                <Loader size={16} color="#22c55e" />
              )}
              {step.status === "pending" && (
                <Circle size={16} color="#94a3b8" />
              )}
            </View>
            <Text
              className={`
                text-xs mt-1 text-center max-w-[60px]
                ${step.status === "completed" ? "text-primary-600 font-medium" : ""}
                ${step.status === "current" ? "text-primary-600 font-medium" : ""}
                ${step.status === "pending" ? "text-gray-400" : ""}
              `}
              numberOfLines={2}
            >
              {step.title}
            </Text>
          </View>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <View
              className={`
                h-0.5 w-8 mx-1
                ${step.status === "completed" ? "bg-primary-500" : "bg-gray-200"}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

interface SimpleProgressProps {
  current: number;
  total: number;
  className?: string;
}

export const SimpleProgress: React.FC<SimpleProgressProps> = ({
  current,
  total,
  className = "",
}) => {
  const progress = Math.min(100, (current / total) * 100);

  return (
    <View
      className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <View
        className="h-full bg-primary-500 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};
