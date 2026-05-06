'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/components/ui/Snackbar';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';

interface ProfileSectionInnerProps {
  profile: any;
  updateProfile: (data: any) => Promise<void>;
  calculateGoal: (weight: number) => number;
}

const ProfileSectionInner: React.FC<ProfileSectionInnerProps> = ({ profile, updateProfile, calculateGoal }) => {
  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState(profile.name || '');
  const [weight, setWeight] = useState<string>(profile.weight_kg?.toString() || '');
  const [isManualGoal, setIsManualGoal] = useState(profile.daily_goal_ml !== calculateGoal(Number(profile.weight_kg)));
  const [manualGoal, setManualGoal] = useState<string>(profile.daily_goal_ml.toString());
  const [defaultCup, setDefaultCup] = useState<string>(profile.default_cup_ml.toString());

  const recommendedGoal = weight ? calculateGoal(Number(weight)) : 2000;

  const handleSave = async (silent = false) => {
    const finalGoal = isManualGoal ? Number(manualGoal) : recommendedGoal;

    if (finalGoal < 500 || finalGoal > 6000) {
      if (!silent) showSnackbar({ message: 'Meta deve ser entre 500ml e 6000ml.' });
      return;
    }

    try {
      await updateProfile({
        name,
        weight_kg: weight ? Number(weight) : undefined,
        daily_goal_ml: finalGoal,
        default_cup_ml: Number(defaultCup),
      });
      if (!silent) showSnackbar({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      if (!silent) showSnackbar({ message: 'Erro ao salvar perfil.' });
    }
  };

  const handleBlur = () => {
    handleSave(true);
  };

  return (
    <section className="space-y-6">
      <div className="space-y-5">
        <Input
          label="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          placeholder="Como te chamamos?"
        />

        <div className="space-y-1">
          <Input
            label="Seu peso (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={handleBlur}
            placeholder="Ex: 70"
            helperText={weight ? `Meta recomendada: ${recommendedGoal}ml` : undefined}
          />
        </div>

        <Toggle
          label="Definir meta manualmente"
          checked={isManualGoal}
          onChange={(e) => {
            setIsManualGoal(e.target.checked);
            // Salva imediatamente quando o toggle muda
            setTimeout(() => handleSave(true), 0);
          }}
        />

        {isManualGoal && (
          <Input
            label="Meta diária (ml)"
            type="number"
            value={manualGoal}
            onChange={(e) => setManualGoal(e.target.value)}
            onBlur={handleBlur}
            placeholder="Ex: 2500"
          />
        )}

        <Input
          label="Recipiente padrão (ml)"
          type="number"
          value={defaultCup}
          onChange={(e) => setDefaultCup(e.target.value)}
          onBlur={handleBlur}
          placeholder="Ex: 200"
        />
      </div>

      <div className="pt-2">
        <Button 
          onClick={() => handleSave(false)} 
          className="w-full bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 h-12 text-base"
        >
          Salvar Alterações
        </Button>
      </div>
    </section>
  );
};

export const ProfileSection: React.FC = () => {
  const { profile, updateProfile, calculateGoal, isLoading } = useSettings();

  if (isLoading || !profile) return null;

  return (
    <ProfileSectionInner 
      key={profile.id} 
      profile={profile} 
      updateProfile={updateProfile} 
      calculateGoal={calculateGoal} 
    />
  );
};
