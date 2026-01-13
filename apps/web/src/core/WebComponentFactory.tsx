// Generic Web Component Factory - Story 1.4
// Creates Web Components from React components for any widget

import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Configuration for creating a Web Component
 */
export interface WebComponentConfig<TProps = any> {
  /**
   * Name of the custom element (e.g., 'date-picker-widget')
   */
  tagName: string;

  /**
   * React component to wrap
   */
  component: React.ComponentType<TProps>;

  /**
   * Attributes to observe for changes
   * Maps attribute name (kebab-case) to prop name (camelCase)
   * Example: { 'trip-id': 'tripId', 'trip-slug': 'tripSlug' }
   */
  observedAttributes: Record<string, string>;

  /**
   * Attributes that should be parsed as JSON
   */
  jsonAttributes?: string[];

  /**
   * Custom event mappings
   * Maps prop callback name to custom event name
   * Example: { onDateSelect: 'date-selected', onClose: 'close' }
   */
  events?: Record<string, string>;

  /**
   * Optional: Transform event data before emitting
   * Key is the prop callback name, value is transformer function
   */
  eventTransformers?: Record<string, (data: any) => any>;

  /**
   * Optional: Whether to use Shadow DOM (default: true)
   */
  useShadowDom?: boolean;

  /**
   * Optional: CSS to inject into Shadow DOM
   */
  styles?: string;
}

/**
 * Creates a Web Component class from a React component
 */
export function createWebComponent<TProps = any>(
  config: WebComponentConfig<TProps>
): CustomElementConstructor {
  const {
    tagName,
    component: Component,
    observedAttributes,
    jsonAttributes = [],
    events = {},
    eventTransformers = {},
    useShadowDom = true,
    styles,
  } = config;

  class GenericWebComponent extends HTMLElement {
    private root: ReactDOM.Root | null = null;
    private mountPoint: HTMLElement | ShadowRoot;

    constructor() {
      super();

      // Create Shadow DOM or use regular DOM
      if (useShadowDom) {
        this.mountPoint = this.attachShadow({ mode: 'open' });
      } else {
        this.mountPoint = this;
      }

      // Create React mount point
      const container = document.createElement('div');
      container.id = `${tagName}-root`;
      this.mountPoint.appendChild(container);
    }

    /**
     * Observed attributes
     */
    static get observedAttributes() {
      return Object.keys(observedAttributes);
    }

    /**
     * Called when element is added to DOM
     */
    connectedCallback() {
      console.log(`[${tagName}] connectedCallback - element added to DOM`);
      this.injectStyles();
      this.render();

      // Re-render when element becomes visible (for x-show compatibility)
      setTimeout(() => {
        if (this.isConnected) {
          console.log(`[${tagName}] Delayed render for visibility`);
          this.render();
        }
      }, 100);
    }

    /**
     * Called when element is removed from DOM
     */
    disconnectedCallback() {
      if (this.root) {
        this.root.unmount();
        this.root = null;
      }
    }

    /**
     * Called when observed attributes change
     */
    attributeChangedCallback(
      _name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    /**
     * Parse attribute value
     */
    private parseAttribute(attrName: string, value: string | null): any {
      if (value === null) return undefined;

      // Get the prop name for this attribute (to check jsonAttributes)
      const propName = observedAttributes[attrName];

      // Parse JSON attributes - check both attribute name (kebab-case) and prop name (camelCase)
      if (jsonAttributes.includes(attrName) || jsonAttributes.includes(propName)) {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.error(`[${tagName}] Failed to parse JSON attribute "${attrName}":`, error);
          return undefined;
        }
      }

      // Return string value
      return value;
    }

    /**
     * Get all props from attributes
     */
    private getPropsFromAttributes(): Partial<TProps> {
      const props: any = {};

      // Map attributes to props
      Object.entries(observedAttributes).forEach(([attrName, propName]) => {
        const attrValue = this.getAttribute(attrName);
        const parsedValue = this.parseAttribute(attrName, attrValue);

        if (parsedValue !== undefined) {
          props[propName] = parsedValue;
        }
      });

      return props;
    }

    /**
     * Create event handler for a callback prop
     */
    private createEventHandler(eventName: string, callbackName: string) {
      return (data: any) => {
        // Transform event data if transformer provided
        const transformer = eventTransformers[callbackName];
        const eventDetail = transformer ? transformer(data) : data;

        // Dispatch custom event
        const event = new CustomEvent(eventName, {
          detail: eventDetail,
          bubbles: true,
          composed: useShadowDom, // Only cross shadow boundary if using shadow DOM
        });

        this.dispatchEvent(event);

        // Log for debugging in development
        if (import.meta.env.DEV) {
          console.log(`[${tagName}] ${eventName} event fired:`, eventDetail);
        }
      };
    }

    /**
     * Get event handlers as props
     */
    private getEventHandlers(): Partial<TProps> {
      const handlers: any = {};

      Object.entries(events).forEach(([callbackName, eventName]) => {
        handlers[callbackName] = this.createEventHandler(eventName, callbackName);
      });

      return handlers;
    }

    /**
     * Inject styles into Shadow DOM
     * Wraps styles in a <style> tag (only when Shadow DOM is used)
     */
    private injectStyles() {
      if (!useShadowDom || !this.mountPoint) return;

      const shadowRoot = this.mountPoint as ShadowRoot;

      // Check if styles already injected
      if (shadowRoot.querySelector(`style[data-widget="${tagName}"]`)) {
        return;
      }

      // Custom styles - wrap in <style> tag
      if (styles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        shadowRoot.appendChild(styleElement);
      }

      // In development, clone Vite's injected styles
      // if (import.meta.env.DEV) {
      //   const mainStyles = document.querySelector('style[data-vite-dev-id]');
      //   if (mainStyles) {
      //     const styleClone = mainStyles.cloneNode(true) as HTMLStyleElement;
      //     styleClone.setAttribute('data-vite-dev-id', '');
      //     styleClone.setAttribute('data-widget', tagName);
      //     shadowRoot.appendChild(styleClone);
      //   }
      // } else {
      //   // Production mode - link to compiled CSS
      //   const link = document.createElement('link');
      //   link.rel = 'stylesheet';
      //   link.href = `/dist/${tagName}.css`;
      //   link.setAttribute('data-widget', tagName);
      //   shadowRoot.appendChild(link);
      // }
    }

    /**
     * Render React component
     */
    private render() {
      const container = this.mountPoint.querySelector(`#${tagName}-root`);
      if (!container) {
        console.error(`[${tagName}] Container not found: #${tagName}-root`);
        return;
      }

      // Combine attribute props and event handlers
      const props = {
        ...this.getPropsFromAttributes(),
        ...this.getEventHandlers(),
      } as TProps;

      console.log(`[${tagName}] Rendering with props:`, props);

      // Create or reuse root
      if (!this.root) {
        this.root = ReactDOM.createRoot(container);
        console.log(`[${tagName}] Created new React root`);
      }

      // Render React component
      this.root.render(React.createElement(Component as React.ComponentType<any>, props));
      console.log(`[${tagName}] React component rendered`);
    }
  }

  return GenericWebComponent as any;
}

/**
 * Register a Web Component
 * Only registers if not already defined (prevents HMR errors)
 */
export function registerWebComponent(
  tagName: string,
  componentClass: CustomElementConstructor
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);

    if (import.meta.env.DEV) {
      console.log(`[WebComponentFactory] Custom element registered: <${tagName}>`);
    }
  }
}

/**
 * Helper: Create and register a Web Component in one call
 */
export function defineWebComponent<TProps = any>(
  config: WebComponentConfig<TProps>
): void {
  const componentClass = createWebComponent(config);
  registerWebComponent(config.tagName, componentClass);
}
