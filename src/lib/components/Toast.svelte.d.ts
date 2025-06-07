/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';
import { Writable } from 'svelte/store';

export interface ToastMessage {
    message: string;
    type: 'error' | 'success';
}

export const toast: Writable<ToastMessage | null>;

export default class Toast extends SvelteComponentTyped<{
    message?: string;
    type?: 'error' | 'success';
}> {} 