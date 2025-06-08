import { browser } from '$app/environment';

declare global {
    interface Window {
        grecaptcha: any;
        onRecaptchaLoad: () => void;
    }
}

interface RecaptchaOptions {
    siteKey: string;
    onVerify?: (token: string) => void;
    onExpire?: () => void;
    onError?: (error: Error) => void;
}

let scriptLoaded = false;
let scriptLoading = false;
let queue: (() => void)[] = [];

function loadRecaptchaScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!browser) {
            resolve();
            return;
        }

        if (scriptLoaded) {
            resolve();
            return;
        }

        if (scriptLoading) {
            queue.push(resolve);
            return;
        }

        scriptLoading = true;
        window.onRecaptchaLoad = () => {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
            queue.forEach(cb => cb());
            queue = [];
        };

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            scriptLoading = false;
            reject(new Error('Failed to load reCAPTCHA'));
            queue.forEach(cb => cb());
            queue = [];
        };

        document.head.appendChild(script);
    });
}

export function showRecaptcha(options: RecaptchaOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const container = document.createElement('div');
        container.className = 'bg-white p-6 rounded-lg shadow-xl';
        
        const title = document.createElement('h3');
        title.className = 'text-lg font-medium mb-4 text-gray-900';
        title.textContent = 'Please verify that you are human';
        
        const recaptchaContainer = document.createElement('div');
        recaptchaContainer.className = 'flex justify-center';
        
        container.appendChild(title);
        container.appendChild(recaptchaContainer);
        modal.appendChild(container);
        document.body.appendChild(modal);

        const cleanup = () => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        };

        loadRecaptchaScript().then(() => {
            const widgetId = window.grecaptcha.render(recaptchaContainer, {
                sitekey: options.siteKey,
                callback: (token: string) => {
                    cleanup();
                    resolve(token);
                    options.onVerify?.(token);
                },
                'expired-callback': () => {
                    cleanup();
                    options.onExpire?.();
                    reject(new Error('reCAPTCHA verification expired'));
                },
                'error-callback': () => {
                    cleanup();
                    const error = new Error('reCAPTCHA verification failed');
                    options.onError?.(error);
                    reject(error);
                }
            });
        }).catch((error) => {
            cleanup();
            options.onError?.(error);
            reject(error);
        });
    });
} 