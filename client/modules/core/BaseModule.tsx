import React from 'react';
import { Employee } from '@shared/types';

/**
 * Interface de base pour tous les modules
 * ✅ Conforme à l'architecture Agentova
 */

export interface ModuleComponentProps {
  employee: Employee;
  onModuleChange?: (moduleId: string) => void;
}

export interface ModuleComponent extends React.FC<ModuleComponentProps> {
  moduleId?: string;
}

/**
 * Crée un module avec les propriétés standardisées
 */
export function createModule(Component: ModuleComponent): ModuleComponent {
  return Component;
}

