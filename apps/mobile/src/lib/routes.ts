import type { Href } from 'expo-router';

/**
 * Centralized route hrefs. Cast through `unknown` so navigation typechecks even
 * when `.expo/types` is stale — those types regenerate on `expo start` / export.
 */
const h = (p: string): Href => p as unknown as Href;

export const routes = {
  // auth
  login: h('/(auth)/login'),
  register: h('/(auth)/register'),
  onboarding: h('/(auth)/onboarding'),
  // shell tabs
  signals: h('/(shell)'),
  portfolio: h('/(shell)/portfolio'),
  learn: h('/(shell)/learn'),
  automation: h('/(shell)/automation'),
  // stack
  assistant: h('/assistant'),
  journal: h('/journal'),
  settings: h('/settings'),
  shell: h('/(shell)'),
} as const;

export const hrefSignal = (id: string): Href => h(`/signal/${id}`);
export const hrefLesson = (id: string): Href => h(`/lesson/${id}`);
