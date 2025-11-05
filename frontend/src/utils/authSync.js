/**
 * Multi-tab authentication synchronization
 * Uses BroadcastChannel API to sync auth state across browser tabs
 */

const AUTH_CHANNEL_NAME = 'auth_sync_channel';

class AuthSyncManager {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    this.init();
  }

  init() {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        this.handleMessage(event.data);
      };
      console.log('[AuthSync] Multi-tab sync initialized');
    } else {
      console.warn('[AuthSync] BroadcastChannel not supported, falling back to localStorage events');
      // Fallback to localStorage events for older browsers
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  handleMessage(data) {
    console.log('[AuthSync] Received message from another tab:', data);
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      listener(data);
    });
  }

  handleStorageEvent(event) {
    // Fallback: listen to localStorage changes (from other tabs only)
    if (event.key === 'auth_event') {
      try {
        const data = JSON.parse(event.newValue);
        this.handleMessage(data);
      } catch (error) {
        console.error('[AuthSync] Failed to parse storage event:', error);
      }
    }
  }

  /**
   * Broadcast authentication event to all tabs
   * @param {string} type - Event type: 'login' | 'logout' | 'token_refresh'
   * @param {object} payload - Event payload
   */
  broadcast(type, payload = {}) {
    const message = {
      type,
      payload,
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(message);
      console.log('[AuthSync] Broadcasting to other tabs:', type);
    } else {
      // Fallback: use localStorage
      localStorage.setItem('auth_event', JSON.stringify(message));
      // Clear immediately so it can be used again
      setTimeout(() => localStorage.removeItem('auth_event'), 100);
    }
  }

  /**
   * Subscribe to auth sync events
   * @param {Function} listener - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    this.listeners.clear();
  }
}

// Singleton instance
const authSync = new AuthSyncManager();

export default authSync;
