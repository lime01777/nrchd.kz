import React, { useState } from 'react';

function OrganizationalStructure({ departments = [] }) {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());

  const toggleDepartment = (departmentId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div 
            key={department.id} 
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Заголовок департамента */}
            <div 
              className="p-4 border-b border-gray-100 cursor-pointer"
              onClick={() => toggleDepartment(department.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {department.name}
                  </h3>
                  {department.description && (
                    <p className="text-sm text-gray-600">
                      {department.description}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      expandedDepartments.has(department.id) ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Сотрудники департамента */}
            {expandedDepartments.has(department.id) && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-3">
                  {department.employees.map((employee, index) => (
                    <div 
                      key={index}
                      className="bg-white p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Аватар сотрудника */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        </div>
                        
                        {/* Информация о сотруднике */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {employee.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {employee.position}
                          </p>
                          {employee.contact && (
                            <div className="mt-2 text-xs text-gray-500">
                              <p>📧 {employee.contact.email}</p>
                              {employee.contact.phone && (
                                <p>📞 {employee.contact.phone}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrganizationalStructure;
