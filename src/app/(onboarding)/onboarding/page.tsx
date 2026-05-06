'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingShell } from '@/components/features/onboarding/OnboardingShell';
import { StepName } from '@/components/features/onboarding/StepName';
import { StepGoal } from '@/components/features/onboarding/StepGoal';
import { StepCup } from '@/components/features/onboarding/StepCup';
import { StepReminders } from '@/components/features/onboarding/StepReminders';
import { StepPermission } from '@/components/features/onboarding/StepPermission';
import { profileRepository } from '@/lib/db/repositories/profileRepository';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentStep,
    formData,
    isSubmitting,
    updateField,
    nextStep,
    prevStep,
    skipStep,
    submit,
  } = useOnboarding();

  useEffect(() => {
    async function checkOnboarding() {
      const done = await profileRepository.isOnboardingDone();
      if (done) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    }
    checkOnboarding();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepName
            value={formData.name}
            onChange={(val) => updateField('name', val)}
          />
        );
      case 2:
        return (
          <StepGoal
            weight={formData.weight_kg}
            dailyGoal={formData.daily_goal_ml}
            isManual={formData.is_manual_goal}
            onWeightChange={(val) => updateField('weight_kg', val)}
            onGoalChange={(val) => updateField('daily_goal_ml', val)}
            onManualToggle={(val) => updateField('is_manual_goal', val)}
          />
        );
      case 3:
        return (
          <StepCup
            value={formData.default_cup_ml}
            onChange={(val) => updateField('default_cup_ml', val)}
          />
        );
      case 4:
        return (
          <StepReminders
            enabled={formData.reminders_enabled}
            interval={formData.reminder_interval_min}
            startTime={formData.reminder_start_time}
            endTime={formData.reminder_end_time}
            message={formData.reminder_message}
            onChange={updateField}
          />
        );
      case 5:
        return <StepPermission onNext={submit} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === 5) {
      submit();
    } else {
      nextStep();
    }
  };

  return (
    <OnboardingShell
      currentStep={currentStep}
      totalSteps={5}
      onBack={prevStep}
      onNext={handleNext}
      onSkip={skipStep}
      isSubmitting={isSubmitting}
    >
      {renderStep()}
    </OnboardingShell>
  );
}
