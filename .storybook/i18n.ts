// Mock i18n setup for Storybook, Hack for translation, this should've been fixed in the component level
const mockTranslations = {
  'ATTRIBUTES.PROJECT.STATUS_ENUM.ACTIVE': 'Active',
  'ATTRIBUTES.PROJECT.STATUS_ENUM.PLANNING': 'Planning', 
  'ATTRIBUTES.PROJECT.STATUS_ENUM.ON_HOLD': 'On Hold',
  'ATTRIBUTES.PROJECT.STATUS_ENUM.COMPLETED': 'Completed',
  'ATTRIBUTES.TASK.STATUS_ENUM.NOT_STARTED': 'Not Started',
  'ATTRIBUTES.TASK.STATUS_ENUM.IN_PROGRESS': 'In Progress',
  'ATTRIBUTES.TASK.STATUS_ENUM.BLOCKED': 'Blocked',
  'ATTRIBUTES.TASK.STATUS_ENUM.FINAL_CHECK': 'Final Check',
  'ATTRIBUTES.TASK.STATUS_ENUM.DONE': 'Done',
  'COMPONENTS.PROJECT_CARD.TASKS': 'tasks',
  'COMPONENTS.PROJECT_CARD.PROGRESS': 'Progress',
  'COMPONENTS.PROJECT_CARD.LAST_UPDATED': 'Last updated',
  'PAGES.PROJECT_DETAILS.TASK.ROOM': 'Room:',
  'PAGES.PROJECT_DETAILS.TASK.ITEMS_DONE': 'items completed',
  'HELPERS.ACTIONS.ACTIONS': 'Actions',
  'HELPERS.ACTIONS.EDIT': 'Edit',
  'HELPERS.ACTIONS.DELETE': 'Delete'
};

// Mock the useTranslation hook
export const useTranslation = () => ({
  t: (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
  }
});

export default {
  t: (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key
};