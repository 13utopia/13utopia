import React from 'react';

export function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.176.2-.352.226-.653.075-1.777-.887-2.94-1.584-4.11-3.593-.31-.533.31-.495.888-1.65.1-.2.05-.376-.025-.527-.075-.15-.678-1.636-.93-2.24-.244-.588-.493-.508-.678-.518-.175-.008-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.08 2.914 1.23 3.115.15.2 2.127 3.248 5.155 4.557 1.916.828 2.668.9 3.626.758.583-.087 1.78-.728 2.03-1.432.251-.703.251-1.306.176-1.432-.075-.125-.276-.2-.577-.35zM12.04 2C6.52 2 2.05 6.47 2.05 11.99c0 1.88.52 3.65 1.43 5.18L2 22l4.98-1.44a9.92 9.92 0 0 0 5.06 1.38c5.52 0 9.99-4.47 9.99-9.99A9.97 9.97 0 0 0 12.04 2zm0 18.23c-1.6 0-3.13-.43-4.47-1.23l-.32-.19-3.32.96.98-3.23-.21-.34a8.19 8.19 0 0 1-1.26-4.21c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24z" />
    </svg>
  );
}

