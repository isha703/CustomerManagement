export type ToastType = 'success' | 'error' | 'info';

export interface AppToastEvent {
  message: string;
  type?: ToastType;
  ttl?: number;
}

/**
 * Dispatch a global toast event. Use from anywhere:
 *   import { showToast } from '../utils/toast';
 *   showToast('Saved', 'success');
 */
export function showToast(message: string, type: ToastType = 'success', ttl = 4000) {
  const ev = new CustomEvent<AppToastEvent>('app-toast', {
    detail: { message, type, ttl },
  } as any);
  window.dispatchEvent(ev);
}