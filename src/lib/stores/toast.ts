import { writable } from 'svelte/store';

export interface ToastMessage {
    type: 'success' | 'error';
    message: string;
}

export const toast = writable<ToastMessage | null>(null); 