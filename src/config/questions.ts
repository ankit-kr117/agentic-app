// The questions asked when you save a checkpoint.
// Add, remove or reword them here. Old checkpoints keep their saved answers.
export interface Question {
  id: string
  prompt: string
  placeholder: string
}

export const QUESTIONS: Question[] = [
  { id: 'worked', prompt: 'What did you work on?', placeholder: 'A quick summary of this session' },
  { id: 'learned', prompt: 'What did you learn?', placeholder: 'New ideas, tricks, facts' },
  { id: 'problems', prompt: 'What problems did you face?', placeholder: 'Bugs, blockers, confusion' },
  { id: 'solved', prompt: 'How did you solve them?', placeholder: 'What finally worked' },
  { id: 'unclear', prompt: 'What is still unclear?', placeholder: 'Questions to chase next time' },
  { id: 'next', prompt: 'What will you do next?', placeholder: 'Your first move for the next session' },
]
