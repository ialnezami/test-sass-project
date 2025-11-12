'use client';

import React, { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AI_EMPLOYEES } from '@/data/ai-employees';
import { getModule } from '@/modules/core/ModuleRegistry';

/**
 * Page dynamique pour les modules des employés
 * Route: /dashboard/employees/[name]/[module]
 * ✅ Conforme à l'architecture Agentova
 */
export default function EmployeeModulePage() {
  const params = useParams();
  const router = useRouter();

  // Extraction des paramètres de la route
  const employeeName = params.name as string;
  const moduleId = params.module as string;

  // Trouver l'employé correspondant et mapper vers le type Employee
  const employee = useMemo(() => {
    const foundEmployee = AI_EMPLOYEES.find(
      emp => emp.id === employeeName || emp.name.toLowerCase() === employeeName.toLowerCase()
    );
    if (!foundEmployee) return null;
    
    // ✅ Mapper AIEmployee vers Employee (type partagé)
    return {
      id: String(foundEmployee.id), // Convertir enum en string
      name: foundEmployee.name,
      hexColor: foundEmployee.hexColor,
      description: foundEmployee.role || `${foundEmployee.name} - Agent IA`
    };
  }, [employeeName]);

  // Récupérer le module correspondant
  const moduleComponent = useMemo(() => {
    return getModule(moduleId);
  }, [moduleId]);

  // Gestion du changement de module (pour navigation future)
  const handleModuleChange = (newModuleId: string) => {
    if (employee) {
      router.push(`/dashboard/employees/${employee.id}/${newModuleId}`);
    }
  };

  // Si l'employé n'existe pas, rediriger vers le dashboard
  useEffect(() => {
    if (!employee) {
      router.push('/dashboard');
    }
  }, [employee, router]);

  // Si le module n'existe pas, rediriger vers le chat par défaut
  useEffect(() => {
    if (employee && !moduleComponent) {
      router.push(`/dashboard/employees/${employee.id}/chat`);
    }
  }, [employee, moduleComponent, router]);

  // Afficher un loader pendant les redirections
  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  if (!moduleComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Module non trouvé, redirection vers le chat...</p>
        </div>
      </div>
    );
  }

  // Afficher le module avec les props appropriées
  const ActiveModule = moduleComponent;

  return (
    <div className="min-h-screen bg-gray-50">
      <ActiveModule 
        employee={employee} 
        onModuleChange={handleModuleChange} 
      />
    </div>
  );
}

