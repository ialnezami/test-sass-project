import React from 'react';
import { createModule, ModuleComponent, ModuleComponentProps } from './core/BaseModule';

/**
 * Module de chat IA
 * ✅ Conforme à l'architecture Agentova
 */

const ChatModule: ModuleComponent = ({ employee, onModuleChange }: ModuleComponentProps) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Chat avec {employee.name}</h2>
      <p className="text-gray-600">Module de chat en cours de développement...</p>
    </div>
  );
};

ChatModule.moduleId = 'chat';

export default createModule(ChatModule);

