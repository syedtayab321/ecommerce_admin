export const modalStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300',
  container: 'bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0', // Initial state
  containerOpen: 'scale-100 opacity-100', // Open state
  header: 'px-6 pt-6 pb-4 border-b border-gray-100',
  title: 'text-2xl font-bold text-gray-900 text-center',
  body: 'px-6 py-5 text-center',
  message: 'text-gray-600 mb-6',
  footer: 'px-6 pb-6 flex flex-col sm:flex-row justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3',
  cancelButton: 'px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors',
  logoutButton: 'px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-colors shadow-sm',
  icon: 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4',
};