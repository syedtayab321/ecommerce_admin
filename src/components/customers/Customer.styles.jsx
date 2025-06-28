export const tableStyles = {
  container: 'overflow-x-auto shadow-md rounded-lg',
  table: 'min-w-full divide-y divide-gray-200',
  thead: 'bg-gradient-to-r from-blue-500 to-blue-600',
  th: 'px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider',
  tr: 'hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
  td: 'px-6 py-4 whitespace-nowrap',
  textPrimary: 'text-sm font-medium text-gray-900',
  textSecondary: 'text-sm text-gray-500',
  actionButton: 'p-1 rounded-full hover:bg-gray-100 transition-colors',
};

export const modalStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  container: 'bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col',
  header: 'px-6 py-4 border-b flex justify-between items-center bg-gray-50',
  title: 'text-xl font-bold text-gray-800',
  closeButton: 'text-gray-500 hover:text-gray-700',
  body: 'flex-1 overflow-y-auto p-6',
  footer: 'px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50',
};